# Pre-Launch Checklist

Things to complete before going live. Grouped by area.

---

## 域名 & 部署 (Domain & Deployment)

### 1. Vercel — 绑定真实域名
- Vercel 控制台 → Project → Settings → Domains → 添加域名
- Vercel 自动签发 HTTPS
- 之后把 `NEXT_PUBLIC_APP_URL` 改成正式域名

### 2. Vercel — 配置所有环境变量
把 `.env` 里所有 key 复制到 Vercel → Settings → Environment Variables。
必填项：

| Key | 备注 |
|---|---|
| `DATABASE_URL` | pgBouncer pooler URL |
| `DIRECT_URL` | 直连 URL（迁移用） |
| `AUTH_SECRET` | 必须和本地一致 |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | 同时更新 Google Console 回调地址 |
| `NEXT_PUBLIC_SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
| `SUPABASE_SERVICE_ROLE_KEY` | |
| `RESEND_API_KEY` | |
| `FROM_EMAIL` | 改成已验证域名的地址 |
| `ADMIN_EMAIL` | 改回真实收件箱 `zsyoscar@gmail.com` |
| `NEXT_PUBLIC_APP_URL` | 正式域名，如 `https://birthdayvid.com` |

### 3. Google OAuth — 添加生产回调地址
Google Console → Credentials → 你的 OAuth client → Authorized redirect URIs，添加：
```
https://yourdomain.com/api/auth/callback/google
```

---

## 邮件 (Email)

### 4. Resend — 验证发件域名
- Resend → Domains → Add Domain → 按提示添加 DNS 记录
- 验证通过后更新 `.env` 和 Vercel 环境变量：
  ```
  FROM_EMAIL="BirthdayVid <noreply@yourdomain.com>"
  ADMIN_EMAIL="zsyoscar@gmail.com"
  ```

### 5. 邮件按钮链接 — 改为动态 URL
管理员通知邮件里"View in Admin Dashboard →"按钮目前是硬编码的占位 URL。

**文件：** `src/lib/email.ts` 第 41 行
```ts
// 改为：
href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin"
```

### 6. 邮件内容国际化（可选）
目前通知邮件内容是纯英文 HTML。如果中文用户也会收到邮件，考虑根据用户语言发对应语言的邮件内容。
**文件：** `src/lib/email.ts`

---

## 表单 & 内容 (Form & Content)

### 7. 移除表单测试预填数据
订单表单为测试方便预填了"Sophie"、年龄"5"等虚假数据，上线前必须还原。

**文件：** `src/app/[locale]/order/[id]/page.tsx`

把 `INITIAL` 常量换回已注释掉的空白版本：
```ts
const INITIAL: FormState = {
  subjectName: "", age: "", birthday: "", occasion: "birthday",
  blessingMessage: "", specialNotes: "", photoFiles: [], voiceFiles: [],
  favouriteColour: "", favouriteAnimal: "", bedtimeStory: false, storyTheme: "",
  styleTag: "", performanceStyle: "", language: "", ageRatingAck: false,
  petType: "", petName: "", personality: "", petOccasion: "birthday",
  coppaConsent: true, portraitConsent: true,
};
```

### 8. 检查并更新表单 placeholder 提示文字
目前部分输入框的 hint text 是英文示例（"e.g. Sophie"、"e.g. Blue"）。
检查 `src/messages/en.json` 和 `src/messages/zh.json` 的 `orderFlow.form` 部分，
确认措辞自然、符合目标用户（北美华人）的表达习惯。

---

## 国际化 (i18n)

### 9. 我的订单页面 — 补充中文翻译
`src/app/[locale]/orders/page.tsx` 目前有几处硬编码英文：
- `"order" / "orders"` 订单数量
- `"Create your first personalised video!"`
- `"Create a Video"` 按钮
- `` `For ${formData.subjectName}` ``

需要迁移到 `en.json` / `zh.json`。

---

## 页面 & 法律 (Pages & Legal)

### 10. 补充隐私政策 & 服务条款页面
页脚的「Privacy」「Terms」「Contact」三个链接目前是 `href="#"`（空链接）。
上线前至少需要有简单的隐私政策和服务条款页面，COPPA 合规也有此要求。

**文件：** `src/app/[locale]/page.tsx`（footer 部分）
需新建页面：
- `src/app/[locale]/privacy/page.tsx`
- `src/app/[locale]/terms/page.tsx`
- `src/app/[locale]/contact/page.tsx`（或直接链接到邮箱 `mailto:`）

---

## SEO & 品牌

### 11. Open Graph / 社交分享图
目前只有基础 `<title>` 和 `<description>`，没有 `og:image`（社交分享时无预览图）。
建议添加：
- 一张 1200×630 的品牌封面图
- `src/app/[locale]/layout.tsx` 里补充 `openGraph` metadata

### 12. Favicon
检查是否有品牌 favicon（目前使用 Next.js 默认图标）。
放入 `public/favicon.ico` 或 `public/favicon.svg` 即可。

---

## Apple 登录（可选）

### 13. Apple OAuth 配置
目前 Apple 登录已条件性跳过（`AUTH_APPLE_ID` 未设置）。
如果上线时要支持 Apple 登录，需要：
- Apple Developer 账号 → 创建 App ID + Services ID
- 将 `AUTH_APPLE_ID` 和 `AUTH_APPLE_SECRET` 填入 `.env` 和 Vercel

---

## 安全 & 稳定性

### 14. 文件上传 — 内容类型校验
目前 `/api/upload` 只检查文件大小，未校验实际文件内容（MIME type 可被伪造）。
上线前建议在服务端做基础的文件头（magic bytes）校验，防止上传恶意文件。
**文件：** `src/app/api/upload/route.ts`

### 15. Supabase Storage — 确认 CORS 配置
切换到生产域名后，检查 Supabase Storage 的 CORS 设置是否允许新域名的请求。
Supabase 控制台 → Storage → 设置。
