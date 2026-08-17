# การตั้งค่าโดเมน osoth.com — End-to-End Report

รายงานการเชื่อมโดเมน **osoth.com** เข้ากับแอป OSOTH บน VPS `147.50.254.104`
ตั้งแต่ DNS ที่ registrar → เว็บเซิร์ฟเวอร์ → HTTPS จนใช้งานได้จริง

| | |
|---|---|
| **ผลลัพธ์** | https://osoth.com (และ `www.`) — HTTPS ใช้งานได้ |
| **วันที่ทำ** | 28–29 ก.ค. 2026 |
| **โดเมน** | osoth.com · จดทะเบียน 2018-03-20 · หมดอายุ 2027-03-20 |
| **Registrar** | OnlineNIC (หน้าจัดการปัจจุบันคือ `grent.com`) · reseller ID `330693` |
| **เซิร์ฟเวอร์** | HostAtom VPS `147.50.254.104` · Debian 13 (trixie) · 4 vCPU / 7.8 GB RAM |
| **แผงควบคุม** | Plesk Obsidian 18.0.79.4 (`:8443`) |

---

## 1. สถานะตั้งต้น (ก่อนเริ่ม)

- `osoth.com` ชี้ไปที่ nameserver **`ns35.appservhosting.com` / `ns35.appservnetwork.com`**
  ซึ่งเป็น zone ที่ **ตายแล้ว** — query แล้วไม่มี A record ใด ๆ กลับมา
  (ยืนยันด้วย `dig` → ไม่มีคำตอบ) ดังนั้นโดเมนนี้ **ยังไม่เคยชี้ไปที่ไหนเลย**
- บนเซิร์ฟเวอร์มีแอปอื่นรันอยู่แล้ว: **AkkraAI Workspace** (Next.js + Postgres) ที่พอร์ต `3000`
  → ตลอดงานนี้ **ห้ามแตะ** และไม่ได้แตะจริง ๆ
- Plesk เป็นเจ้าของพอร์ต 80/443 อยู่ พร้อม mail (Postfix/Dovecot), DNS (BIND), panel (`:8443`)
- แอป OSOTH ถูก deploy เป็น Docker (app + mongo) เรียบร้อยแล้ว รอเพียงโดเมน

**ข้อจำกัดที่ต้องเคารพ:** ห้ามยึดพอร์ต 80/443 แบบดิบ ๆ, ห้ามเปิด UFW ปิดพอร์ต Plesk/mail/DNS,
และห้ามทำให้ AkkraAI ล่ม

---

## 2. เลือกเส้นทาง DNS

มี 2 ทางเลือก:

| ทาง | วิธี | ข้อดี / ข้อเสีย |
|---|---|---|
| **A record** | แก้ที่ DNS host เดิม (AppServ) ชี้ `osoth.com` → IP | ง่าย แต่ต้องเข้าถึงแผง AppServ ซึ่งดูจะไม่ได้ใช้แล้ว |
| **Vanity nameserver** ✅ | ย้าย NS มาที่เซิร์ฟเวอร์ตัวเอง (`ns1/ns2.osoth.com`) | จบในที่เดียว — Plesk เป็น authoritative DNS เอง แก้ record อะไรก็ทำบนเซิร์ฟเวอร์ได้เลย |

**เลือกทางที่ 2** เพราะตอนสร้างโดเมนใน Plesk ระบบ generate DNS zone ที่ถูกต้องให้อัตโนมัติอยู่แล้ว
และเซิร์ฟเวอร์ตอบ DNS query จากอินเทอร์เน็ตได้จริง (ทดสอบแล้ว port 53 เปิด ทั้ง UDP/TCP)

> ⚠️ ทางนี้ต้องจด **glue record** ก่อน เพราะ `ns1.osoth.com` เป็น subdomain ของตัวเอง
> ถ้าไม่จด IP ของ nameserver ไว้ที่ registry จะเกิด circular dependency แล้ว resolve ไม่ได้

---

## 3. ขั้นตอนที่ทำจริง

### 3.1 สร้างโดเมนใน Plesk + DNS zone

```bash
# สร้าง subscription (ครั้งแรกยังไม่มี hosting)
plesk bin subscription --create osoth.com -owner admin -ip 147.50.254.104 \
  -login osoth_sys -passwd '<generated>' -notify false

# เพิ่ม physical hosting → ได้ nginx vhost + docroot + รองรับ Let's Encrypt
plesk bin domain --update osoth.com -hosting true -hst_type phys \
  -ip 147.50.254.104 -login osoth_sys -passwd '<generated>'
```

Plesk สร้าง DNS zone ให้อัตโนมัติ ครบทั้ง web + mail:

```
osoth.com.       A     147.50.254.104
www.osoth.com.   CNAME osoth.com.
ns1.osoth.com.   A     147.50.254.104     ← ใช้เป็น nameserver
ns2.osoth.com.   A     147.50.254.104     ← ใช้เป็น nameserver
osoth.com.       NS    ns1.osoth.com.
osoth.com.       NS    ns2.osoth.com.
osoth.com.       MX 10 mail.osoth.com.
osoth.com.       TXT   v=spf1 ... -all              (SPF)
_dmarc           TXT   v=DMARC1; p=quarantine; ...  (DMARC)
default._domainkey TXT v=DKIM1; ...                 (DKIM)
```

ตรวจว่าเซิร์ฟเวอร์ตอบ DNS จากภายนอกได้จริง (สำคัญมาก — ถ้าข้อนี้ไม่ผ่าน delegation จะพัง):

```bash
dig +short @147.50.254.104 osoth.com A     # → 147.50.254.104 ✓
dig +short @147.50.254.104 osoth.com NS    # → ns1/ns2.osoth.com ✓
dig +short +tcp @147.50.254.104 osoth.com  # TCP ก็ต้องผ่าน ✓
```

### 3.2 จด glue record ที่ registrar

เข้าแผง OnlineNIC/Grent → **DNS Power Tools → Register DNS** (`manage_dns/host_reg.php`)
จด 2 host:

| NameServer | IP Address |
|---|---|
| `ns1.osoth.com` | `147.50.254.104` |
| `ns2.osoth.com` | `147.50.254.104` |

ทั้งสองรายการขึ้น **"Success!"**

### 3.3 เปลี่ยน nameserver ของโดเมน

เส้นทางในแผง: **Manage Domain → List My Domains** → ค้นหา `osoth.com` → คลิกลิงก์คอลัมน์ DNS
(`manage_domains/mod_dns.php?domain=osoth.com&domain_id=5968719`)

กรอก:
```
DNS1: ns1.osoth.com
DNS2: ns2.osoth.com
```

> ### 🔴 ปัญหาที่เจอ: backend ของ OnlineNIC พัง
>
> กด Submit แล้วหน้า confirm (`mod_dns_step2.cgi`) **กลับมาว่างเปล่า** และบางครั้งขึ้น
> **`(15) Connect database error.`**
>
> **พิสูจน์ว่าเป็นบั๊กฝั่งเขา ไม่ใช่ค่าที่เรากรอก:** ลอง submit nameserver **ชุดเดิม**
> (ไม่เปลี่ยนอะไรเลย) ก็ได้หน้าว่างเหมือนกัน → CGI ตัวนี้พังกับทุกค่า
>
> ตรวจเพิ่มแล้วพบว่า **โดเมนไม่ได้ถูกล็อก** (status = OK) จึงไม่ใช่สาเหตุ
> ลอง retry อัตโนมัติทุก 5 นาที หลายรอบก็ยังไม่ผ่าน
>
> **ทางออก:** ผู้ใช้กด Submit เองจากเบราว์เซอร์แล้วผ่าน ✅
> (ระบบเขาน่าจะฟื้นพอดี หรือ flow ผ่าน UI จริงมีบางอย่างต่างจาก automation)

ผลลัพธ์: หน้า domain list แสดง DNS = **`ns1.osoth.com`**

### 3.4 รอ propagation

```bash
dig +short NS osoth.com          # → ns1.osoth.com. ns2.osoth.com. ✓
dig +short A  osoth.com @8.8.8.8 # → 147.50.254.104 ✓
dig +short A  osoth.com @9.9.9.9 # → 147.50.254.104 ✓
```

ใช้เวลาไม่นาน (หลัก 10 นาที) — Google/Quad9 เห็นก่อน, Cloudflare cache ตามมาทีหลัง

### 3.5 ออกใบรับรอง HTTPS (Let's Encrypt)

พอ DNS ชี้มาถูกแล้ว ก็ขอ cert ได้ทันที:

```bash
plesk bin extension --exec letsencrypt cli.php \
  -d osoth.com -d www.osoth.com -m akkraaiclaude@gmail.com
```

ตรวจผล:
```bash
echo | openssl s_client -servername osoth.com -connect osoth.com:443 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName
# issuer=C=US, O=Let's Encrypt  ✓
```

---

## 4. ชั้นเว็บเซิร์ฟเวอร์ (reverse proxy)

### ตอนตั้งค่าครั้งแรก — Plesk nginx

โจทย์คือ Plesk มี `location /` ของตัวเอง (ชี้ไป Apache) อยู่แล้ว ถ้าเพิ่มซ้ำจะ error
`duplicate location "/"` และไฟล์ vhost ที่ Plesk generate ก็ห้ามแก้ตรง ๆ (เขียนทับเมื่อ reconfigure)

**วิธีแก้:** เขียนลงไฟล์ custom directives ของ Plesk ที่
`/var/www/vhosts/system/osoth.com/conf/vhost_nginx.conf` โดยใช้ **regex location**
ซึ่ง priority สูงกว่า prefix `location /` ธรรมดา — เลี่ยงการชนโดยไม่ต้องแก้ไฟล์ที่ Plesk คุม
และยังต่ำกว่า `^~ /.well-known/acme-challenge/` ของ Plesk จึงไม่พัง Let's Encrypt

```nginx
location ~ ^/ {                       # regex → ชนะ location / ของ Plesk โดยไม่ duplicate
    proxy_pass http://127.0.0.1:3100;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 300s;
}
```

จากนั้น `plesk sbin httpdmng --reconfigure-domain osoth.com` แล้ว `nginx -t`

### สถานะปัจจุบัน — เปลี่ยนมาใช้ **Caddy** แล้ว

หลังจากนั้นมีการเปลี่ยนสถาปัตยกรรม: **Caddy** ถือพอร์ต 80/443 แทน (nginx = `inactive`)
Caddy จัดการ TLS อัตโนมัติ (ออก cert แยกใบต่อ hostname) และ route ให้ทั้ง app + socket:

```caddyfile
osoth.com, www.osoth.com, ipv4.osoth.com {
    import mailcfg
    handle /socket.io* { reverse_proxy 127.0.0.1:3102 }   # realtime
    handle_path /osoth* { redir https://osoth.com{uri} 302 }  # subpath เดิม → root
    handle { reverse_proxy 127.0.0.1:3100 }               # ตัวแอป
}
webmail.osoth.com { reverse_proxy 127.0.0.1:8880 }
```

> DNS + glue + delegation ที่ทำในรายงานนี้ **ยังใช้เหมือนเดิมทั้งหมด**
> เปลี่ยนเฉพาะตัวที่รับ request หน้าสุด (nginx → Caddy)

---

## 5. สถาปัตยกรรมปัจจุบัน

```
เบราว์เซอร์  https://osoth.com
      │
      │  DNS: osoth.com → NS ns1/ns2.osoth.com (glue → 147.50.254.104)
      │       → A 147.50.254.104
      ▼
   Caddy  (:80 redirect → :443, TLS อัตโนมัติ)
      │
      ├── /socket.io*  → 127.0.0.1:3102 ─→ osoth-socket-1
      ├── /osoth*      → redirect ไป root
      └── อื่น ๆ ทั้งหมด → 127.0.0.1:3100 ─→ osoth-app-1  (Next.js)
                                                  │
                                                  ├── osoth-mongo-1  (ภายในเท่านั้น)
                                                  └── osoth-redis-1  (ภายในเท่านั้น)
```

คอนเทนเนอร์ทั้งหมด bind `127.0.0.1` เท่านั้น → เข้าถึงได้ผ่าน Caddy ทางเดียว
ส่วน AkkraAI ยังอยู่ที่พอร์ต 3000 ไม่ถูกแตะต้อง

---

## 6. ผลการตรวจสอบ (ยืนยันจากเครื่องภายนอก)

| ตรวจ | ผล |
|---|---|
| `dig NS osoth.com` | `ns1.osoth.com.` `ns2.osoth.com.` ✅ |
| `dig A osoth.com` | `147.50.254.104` ✅ |
| `https://osoth.com/` | **200** ✅ |
| `http://osoth.com/` | **308** → `https://osoth.com/` ✅ |
| `https://www.osoth.com/` | **200** ✅ |
| ใบรับรอง | Let's Encrypt · `CN=osoth.com` (www มีใบแยก `CN=www.osoth.com`) ✅ |
| หน้าร้าน / API | `/store`, `/api/public/storefront` → 200 ✅ |
| Login ผ่าน HTTPS | `admin/1234` → 200, ได้ JWT ✅ |

---

## 7. บทเรียน / จุดที่ต้องระวัง

1. **Glue record ต้องจดก่อนเปลี่ยน NS เสมอ** เมื่อใช้ nameserver ที่เป็น subdomain ของตัวเอง
2. **`(15) Connect database error` ของ OnlineNIC** — เป็นบั๊กฝั่ง registrar ไม่ใช่ค่าที่กรอก
   วิธีพิสูจน์: submit ค่าเดิมแบบไม่เปลี่ยนอะไร ถ้ายังพัง = ปัญหาที่เขา
   ถ้าเจออีก ให้ลองผ่าน UI เอง หรือติดต่อ livechat ของเขา
3. **อย่าแก้ไฟล์ vhost ที่ Plesk generate โดยตรง** — ใช้ `vhost_nginx.conf` เท่านั้น
   ถ้าชนกับ `location /` ของ Plesk ให้ใช้ regex `location ~ ^/`
4. **ต้องกัน `/.well-known/acme-challenge/`** ไม่ให้ถูก proxy ไปแอป ไม่งั้นออก cert ไม่ได้
5. **ยิง port scan ใส่เซิร์ฟเวอร์ Plesk แล้วโดน fail2ban แบน** (SSH + panel ปิดใส่ IP เรา)
   ระหว่างงานนี้เคยโดน — แก้โดยรอ ban หมดอายุ แล้ว whitelist IP:
   ```bash
   fail2ban-client set ssh addignoreip <YOUR_IP>
   ```
   วิธีเลี่ยง: ใช้ SSH connection เดียวแบบ multiplex (`ControlMaster`) แทนการต่อใหม่ซ้ำ ๆ

---

## 8. งานดูแลต่อ

**ต่ออายุใบรับรอง** — Caddy ต่อให้อัตโนมัติ ไม่ต้องทำอะไร
(สมัยใช้ Plesk คือ Let's Encrypt extension ต่อให้เอง)

**ถ้าอยากเพิ่ม subdomain** (เช่น `api.osoth.com`) — ตอนนี้เราคุม DNS zone เอง ทำบนเซิร์ฟเวอร์ได้เลย:
```bash
plesk bin dns --add osoth.com -a api -ip 147.50.254.104
```
แล้วเพิ่ม block ใน `/etc/caddy/Caddyfile` + `systemctl reload caddy`

**ถ้า `/osoth` route หาย** (กรณีย้อนกลับไปใช้ nginx) — รันสคริปต์ idempotent:
```bash
/opt/osoth/apply-nginx-osoth.sh
```

**ตรวจสุขภาพเร็ว ๆ**
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://osoth.com/
dig +short A osoth.com
docker ps --format '{{.Names}} {{.Status}}'
```

---

## 9. หมายเหตุด้านความปลอดภัย

- **รหัสผ่าน seed ยังเป็นค่าเริ่มต้น `1234` ทั้ง 12 บัญชี** (`owner`, `admin`, …)
  → ควรเปลี่ยนของ `owner`/`admin` ก่อนใช้งานจริง
- ระหว่างงานนี้มีการส่ง **รหัสผ่าน root ของ VPS, รหัสผ่าน OnlineNIC และไฟล์ session cookie**
  ผ่านแชต → ควร **เปลี่ยนรหัสผ่านทั้งหมด** และ logout session เดิม
- ไฟล์ที่ห้ามหลุดเข้า git/image — ตรวจแล้วว่า ignore ครบ:
  `*.pem`, `.env`, `.claude/` (มี cookie), `grent_com_cookies.json`
- `.env` บนเซิร์ฟเวอร์ตั้ง `chmod 600` และ `AUTH_SECRET` เป็นค่าสุ่ม 32 ไบต์
- MongoDB / Redis ไม่เปิดพอร์ตออกสู่ภายนอก (internal network เท่านั้น)

---

*รายงานนี้บันทึกงานวันที่ 28–29 ก.ค. 2026 · สถานะระบบตรวจสอบล่าสุด 30 ก.ค. 2026*
