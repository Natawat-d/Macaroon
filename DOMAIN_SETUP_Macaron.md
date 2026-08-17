# การตั้งค่าโดเมน hellomacaron.com — End-to-End Report

รายงานการเชื่อมโดเมน **hellomacaron.com** เข้ากับแอป **Macaron** (ร้านขายเครื่องสำอาง)
บน VPS `147.50.254.104` ตั้งแต่ DNS ที่ registrar → reverse proxy → HTTPS จนใช้งานได้จริง

| | |
|---|---|
| **ผลลัพธ์** | https://hellomacaron.com (และ `www.`) — HTTPS ใช้งานได้ |
| **วันที่ทำ** | 17 ส.ค. 2026 |
| **โดเมน** | hellomacaron.com · จดทะเบียน 2026-08-17 · หมดอายุ 2027-08-17 · domain_id `6868631` |
| **Registrar** | OnlineNIC (หน้าจัดการคือ `grent.com`) |
| **เซิร์ฟเวอร์** | VPS `147.50.254.104` · Debian 13 · Plesk Obsidian + BIND |
| **หน้าสุด** | Caddy ถือพอร์ต 80/443 (ไม่ใช่ Plesk nginx) |
| **แอป** | Next.js 16 + React 19 + Tailwind v4 · Docker · `127.0.0.1:3400` |

> ทำตามแนวทางเดียวกับ [`DOMAIN_SETUP_Osoth.md`](DOMAIN_SETUP_Osoth.md) แต่ต่างที่
> **ชั้น proxy เป็น Caddy ตั้งแต่แรก** จึงไม่ต้องเปิด hosting ใน Plesk

---

## 1. สถานะตั้งต้น

- `hellomacaron.com` ชี้ที่ **`ns35.appservhosting.com` / `ns35.appservnetwork.com`** (zone ตายแล้ว — ไม่มี A record)
- แอป Macaron deploy อยู่แล้วที่ `127.0.0.1:3400` เสิร์ฟที่ `147.50.254.104/macaroon`
  โดยใช้ `basePath: "/macaroon"` ใน `next.config.ts`
- บนเครื่องมีแอปอื่นรันอยู่ **11 ตัว** (agogoes, risr-*, osoth, ctrl, shyp, akkra) + Caddy + mail + Plesk
  → **ห้ามแตะทั้งหมด** และไม่ได้แตะจริง (มีผลตรวจ regression ในข้อ 6)

---

## 2. เลือกเส้นทาง DNS

เลือก **vanity nameserver** เหมือน osoth — `ns1/ns2.hellomacaron.com` ชี้มาที่เครื่องตัวเอง
เพราะ Plesk generate zone ให้ครบอยู่แล้ว และเราคุม record ได้เองบนเซิร์ฟเวอร์

> ⚠️ ต้องจด **glue record** ก่อนเสมอ ไม่งั้นจะเจอ
> **`(1185) DNS1 has not been registered, modification failed.`** ← เจอจริงในงานนี้

---

## 3. ขั้นตอนที่ทำจริง

### 3.1 สร้าง DNS zone ใน Plesk

ต่างจาก osoth ตรงที่ **ไม่เปิด hosting** (`-hosting false`) เพราะ Caddy เป็นคนเสิร์ฟ
ไม่ต้องใช้ vhost/docroot ของ Plesk และไม่ต้องสร้าง system user:

```bash
plesk bin subscription --create hellomacaron.com -owner admin -ip 147.50.254.104 -hosting false
```

Plesk generate zone ให้อัตโนมัติครบ:

```
hellomacaron.com.       A     147.50.254.104
www.hellomacaron.com.   CNAME hellomacaron.com.
ns1.hellomacaron.com.   A     147.50.254.104
ns2.hellomacaron.com.   A     147.50.254.104
hellomacaron.com.       NS    ns1 / ns2.hellomacaron.com.
hellomacaron.com.       MX 10 mail.hellomacaron.com.
+ SPF / DKIM / DMARC / SRV
```

เพิ่ม NS ของ osoth เข้าไปด้วย เผื่อใช้เป็นทางสำรอง (delegate ได้ทันทีโดยไม่ต้องจด glue):

```bash
plesk bin dns --add hellomacaron.com -ns "" -nameserver ns1.osoth.com
plesk bin dns --add hellomacaron.com -ns "" -nameserver ns2.osoth.com
```

ตรวจว่า named ตอบแบบ authoritative (`aa` flag ต้องขึ้น):

```bash
dig @127.0.0.1 hellomacaron.com A +noall +comment +answer   # flags: qr aa rd ra ✓
```

### 3.2 จด glue record ที่ registrar

**DNS Power Tools → Register DNS** → `grent.com/cp_english/manage_dns/host_reg.php`
form post ไปที่ `form_host_reg.php` (field: `dns`, `ip`) — ไม่มี CSRF token

| NameServer | IP Address | ผล |
|---|---|---|
| `ns1.hellomacaron.com` | `147.50.254.104` | **Success!** |
| `ns2.hellomacaron.com` | `147.50.254.104` | **Success!** |

ยืนยันที่ registry:

```bash
whois -h whois.verisign-grs.com "nameserver ns1.hellomacaron.com"
# Server Name: NS1.HELLOMACARON.COM · IP Address: 147.50.254.104 ✓
```

### 3.3 เปลี่ยน nameserver ของโดเมน

**Manage Domain → List My Domains** → ค้นหา `hellomacaron.com` → คลิกคอลัมน์ DNS
`manage_domains/mod_dns.php?domain=hellomacaron.com&domain_id=6868631`
form post ไปที่ `/cgi-bin/cp_en/mod_dns_step2.cgi` (field: `dns_new_1..6`, `dns_type=2`, `domain_id=hellomacaron.com|6868631`)

```
ns35.appservhosting.com  →  ns1.hellomacaron.com   Modify Successfully
ns35.appservnetwork.com  →  ns2.hellomacaron.com   Modify Successfully
```

> 🟢 **รอบนี้ `mod_dns_step2.cgi` ไม่พัง** (ต่างจากตอน osoth ที่ขึ้น `(15) Connect database error`)

### 3.4 Propagation

เร็วมาก — Google/Quad9 เห็นภายใน ~1 นาที, Cloudflare ตามมาทีหลังเหมือนเดิม

```bash
whois -h whois.verisign-grs.com "domain hellomacaron.com" | grep 'Name Server'
# NS1.HELLOMACARON.COM / NS2.HELLOMACARON.COM ✓
dig +short A hellomacaron.com @8.8.8.8   # 147.50.254.104 ✓
```

### 3.5 Caddy + Let's Encrypt

เพิ่ม site block (Caddy ขอ cert ให้เองอัตโนมัติ):

```caddyfile
hellomacaron.com, www.hellomacaron.com {
	import mailcfg
	reverse_proxy 127.0.0.1:3400
}
```

ได้ cert ภายใน ~5 วินาทีหลัง reload (HTTP-01 challenge ผ่านทั้งสอง hostname)

### 3.6 ย้ายแอปขึ้น root + redirect ของเดิม

1. เอา `basePath: "/macaroon"` ออกจาก `next.config.ts`
2. แก้ healthcheck ทั้งใน `docker-compose.yml` และ `Dockerfile` จาก `/macaroon` → `/`
3. **build ก่อน แล้วค่อย swap** (คอนเทนเนอร์เดิมยังเสิร์ฟอยู่ตอน build):
   ```bash
   docker compose build      # ช้า — ของเดิมยังทำงาน
   docker compose up -d      # เร็ว — สลับจริง (วัดได้ 2 วินาที)
   ```
4. เปลี่ยน `/macaroon` บน IP เป็น redirect

---

## 4. สถาปัตยกรรมปัจจุบัน

```
เบราว์เซอร์  https://hellomacaron.com
      │  DNS: NS ns1/ns2.hellomacaron.com (glue → 147.50.254.104) → A 147.50.254.104
      ▼
   Caddy (:80 → :443, TLS อัตโนมัติ)
      ├── hellomacaron.com, www.  → 127.0.0.1:3400 ─→ macaron-app (Next.js)
      └── 147.50.254.104/macaroon → 302 → https://hellomacaron.com
```

คอนเทนเนอร์ bind `127.0.0.1:3400` เท่านั้น → เข้าได้ทาง Caddy ทางเดียว

---

## 5. ⚠️ บั๊กที่ตรวจเจอก่อน deploy (จาก adversarial review 46 agents)

รันรีวิวแผน cutover ก่อนลงมือ แล้วเจอ 5 ข้อ — 2 ข้อสำคัญมาก:

### 5.1 แผนเดิมทำให้เว็บ **ล่มทั้งหมด** (critical)

ถ้าทำ "ถอด basePath + เปลี่ยน /macaroon เป็น redirect + reload" พร้อมกันตอน DNS ยังไม่ propagate:

- ถอด basePath → `/macaroon` บน IP กลายเป็น 404 (block ใช้ `handle` ส่ง path เต็มไปให้แอป)
- redirect → ชี้ไปโดเมนที่ยัง resolve ไม่ได้
- Caddy ออก **308 HTTP→HTTPS ให้ named site เสมอ** แม้ยังไม่มี cert → `:443` จับมือไม่ได้

→ **ไม่เหลือทางเข้าเลยสักทาง** และ rollback ก็พัง (image ใหม่ยิง `/_next/*` แบบ root-absolute
ซึ่ง IP site จะโยนเข้า Plesk catch-all)

**วิธีแก้:** แบ่งเป็น 3 phase มี gate คั่น — DNS resolve ✓ → cert ออกจริง ✓ → ค่อยสลับ

### 5.2 `handle_path /macaroon*` เป็น **open redirect** (major)

```caddyfile
# ผิด — /macaroon@evil.com จะถูก strip เหลือ @evil.com
handle_path /macaroon* { redir https://hellomacaron.com{uri} 302 }
#   → https://hellomacaron.com@evil.com   (โดเมนเรากลายเป็นแค่ userinfo!)
```

**แก้โดย anchor ที่ตัวคั่น path:**

```caddyfile
handle /macaroon        { redir https://hellomacaron.com/ 302 }
handle_path /macaroon/* { redir https://hellomacaron.com{uri} 302 }
```

> 🔴 block `handle_path ... redir ...{uri}` อื่น ๆ ในไฟล์เดียวกันใช้รูปแบบเดิมอยู่
> ยังไม่ได้แก้เพราะเจ้าของสั่งห้ามแตะแอปอื่น — **ควรตามแก้ให้ครบ** (ดูรายละเอียดใน internal note)

### 5.3 restore ตอน reload fail ด้วย ไม่ใช่แค่ตอน validate fail

`caddy validate` ผ่าน ไม่ได้แปลว่า reload จะผ่าน — สคริปต์ `caddy-phase.sh` จึง restore backup
ทั้งกรณี validate fail และ reload fail (+ เช็ค `systemctl is-active` ซ้ำ)

---

## 6. ผลการตรวจสอบ

| ตรวจ | ผล |
|---|---|
| `https://hellomacaron.com/` · `/shop` · `/studio` · `/product/*` | **200** ทั้งหมด ✅ |
| `https://www.hellomacaron.com/` | **200** ✅ |
| `http://hellomacaron.com/` → https | **200** ✅ |
| ใบรับรอง | Let's Encrypt · `CN=hellomacaron.com` · หมดอายุ 15 พ.ย. 2026 ✅ |
| `/macaroon` → `https://hellomacaron.com/` | ✅ |
| `/macaroon/shop` → `.../shop` | ✅ deep link ตามไปด้วย |
| `/macaroon/product/x?a=1` → `.../product/x?a=1` | ✅ query string ครบ |
| `/macaroon@attacker.tld/x` | **ไม่ redirect** ✅ (กัน open redirect ได้) |
| **Regression** agogoes · risr/hris · risr/booking · risr/ticket · risr · Plesk · osoth · ctrl · webmail | **200 ครบ 9 ตัว** ✅ |

---

## 7. บทเรียน

1. **glue ต้องมาก่อน NS เสมอ** — ไม่งั้นเจอ `(1185) DNS1 has not been registered`
2. **cookie ของแผง grent scope อยู่ที่ apex `grent.com`** (host-only ไม่มีจุดนำหน้า)
   ยิงไป `www.grent.com` แล้ว PHPSESSID จะ **ไม่ถูกส่ง** → เด้ง login ทุกครั้ง
   เสียเวลาไล่ผิดทางอยู่นาน เพราะไปสรุปว่า "session ผูกกับ IP" ทั้งที่แค่ยิงผิด host
3. **Caddy ออก 308 → HTTPS ให้ named site แม้ยังไม่มี cert** — อย่าเพิ่มโดเมนก่อน DNS พร้อม
4. **`handle` ≠ `handle_path`** — อันแรกส่ง path เต็ม (แอปต้องมี basePath), อันหลัง strip ทิ้ง
   และ wildcard ต้อง anchor ที่ `/` ไม่งั้นเป็นช่องโหว่
5. **build ก่อน swap ทีหลัง** — ลดช่วงที่ URL เดิมล่มจากหลักนาทีเหลือ 2 วินาที

---

## 8. งานดูแลต่อ

**cert** — Caddy ต่ออายุให้เอง

**เพิ่ม subdomain** (เช่น `api.hellomacaron.com`):
```bash
plesk bin dns --add hellomacaron.com -a api -ip 147.50.254.104
# แล้วเพิ่ม block ใน /etc/caddy/Caddyfile + systemctl reload caddy
```

**deploy แอปใหม่:**
```bash
rsync -az --delete --exclude node_modules --exclude .next --exclude .git \
  -e "ssh -i ~/.ssh/akkra_deploy" ./ root@147.50.254.104:/opt/macaron/
ssh -i ~/.ssh/akkra_deploy root@147.50.254.104 'cd /opt/macaron && docker compose up -d --build'
```

**ตรวจสุขภาพเร็ว ๆ:**
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://hellomacaron.com/
dig +short A hellomacaron.com
docker ps --filter name=macaron-app --format '{{.Status}}'
```

**backup ของ Caddyfile ที่งานนี้สร้างไว้** (เรียงตามเวลา):
`/etc/caddy/Caddyfile.bak.macaroon-*` · `.bak.phase2-*` · `.bak.phase3-*`

---

## 9. หมายเหตุด้านความปลอดภัย

- **มีการส่ง session cookie ของแผง registrar ผ่านแชตในงานนี้** → ควร **logout session เดิม**
- ไฟล์ cookie ถูกเพิ่มใน `.gitignore` แล้ว (`grent_com_cookies.json`, `*_cookies.json`)
  และ `--exclude` ตอน rsync ขึ้นเซิร์ฟเวอร์ → ไม่หลุดขึ้น GitHub และไม่ขึ้น VPS
- แผง registrar บัญชีนี้มีโดเมนอื่นอีกหลายสิบตัว — ทุก request ที่ยิงล็อกไว้เฉพาะ
  `hellomacaron.com|6868631` เท่านั้น ไม่แตะโดเมนอื่น
- `/macaroon` ยัง redirect อยู่ ไม่ได้ปิด — ลิงก์เก่ายังใช้ได้

---

*รายงานนี้บันทึกงานวันที่ 17 ส.ค. 2026*
