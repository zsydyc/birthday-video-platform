# Pre-Launch Checklist

Things to complete before going live. Grouped by area.

---

## 流量跟踪 (Analytics)

### 1. 接入 Google Tag Manager / Google Analytics
目前没有任何用户行为数据。上线前接入 GTM，可以追踪：
- 页面访问量、跳出率
- 下单漏斗（各步骤转化率）
- 用户来源（哪个渠道带来流量）

**推荐方案：** 先接 GTM（容器方式），后续可在 GTM 里灵活添加 GA4、Meta Pixel 等。

**步骤：**
1. 在 [tagmanager.google.com](https://tagmanager.google.com) 创建账号和容器，拿到 GTM 容器 ID（格式 `GTM-XXXXXX`）
2. 在 `.env` 和 Vercel 环境变量中添加：
   ```
   NEXT_PUBLIC_GTM_ID="GTM-XXXXXX"
   ```
3. 在 `src/app/[locale]/layout.tsx` 里嵌入 GTM 脚本（`<head>` 和 `<body>` 各一段）
4. 在 GTM 里配置 GA4 代码，连接 Google Analytics 属性

**文件：** `src/app/[locale]/layout.tsx`

---

## 下单体验优化 (Order UX)

### 2. 手机端上传优化 — 允许拍照直接上传
目前文件上传输入框在手机上打开的是系统文件选择器，体验不够流畅。
添加 `capture` 和 `accept` 属性，让用户可以直接调用手机相机拍照。

**步骤：**
在照片上传的 `<input>` 添加属性，或在手机端额外显示一个"📷 拍照上传"入口：
```html
<!-- 允许相册 + 相机 -->
<input type="file" accept="image/*" capture="environment" multiple />
```
也可以做成两个按钮：一个选相册、一个直接拍照，覆盖不同使用场景。

**文件：** `src/app/[locale]/order/[id]/page.tsx`（Media 上传区域）

### 3. 手机端上传优化 — 支持上传视频
允许用户上传视频片段（例如宝宝的小视频），作为视频制作的素材。

**注意：** 视频文件体积远大于图片，需提前确认：
- Supabase Storage 套餐的存储空间和带宽是否够用
- 上传大小限制（目前 `/api/upload` 限制 20 MB，视频可能需要提高到 200-500 MB）
- 是否需要做视频压缩（客户端压缩 or 服务端转码）

**步骤：**
1. 在 Supabase 控制台确认存储配额
2. 调整 `src/app/api/upload/route.ts` 里的 `MAX_BYTES`
3. 在表单新增视频上传区域，`accept="video/*"`

**文件：** `src/app/api/upload/route.ts`、`src/app/[locale]/order/[id]/page.tsx`

---

## 微信对接 (WeChat Contact)

### 4. 添加微信联系入口
为有需求的用户提供微信咨询渠道，降低沟通门槛（尤其是中文用户）。

**方案（二选一）：**

**A. 显示微信号 + 二维码：**
- 在页脚或"联系我们"页面显示微信号和二维码图片
- 简单直接，无需后端

**B. 微信客服 / 社群入口：**
- 如果有公众号或企业微信，可放公众号二维码
- 用户扫码关注后，可通过公众号消息对接

**建议：** MVP 阶段用方案 A，用静态二维码图片即可。
先把微信号或二维码图片准备好，放到 `public/` 目录，然后在页脚和联系页面引用。

**文件：** `src/app/[locale]/page.tsx`（footer）、`src/app/[locale]/contact/page.tsx`（待创建）

---

## 域名 & 部署 (Domain & Deployment)

### 5. Vercel — 绑定真实域名
- Vercel 控制台 → Project → Settings → Domains → 添加域名
- Vercel 自动签发 HTTPS
- 之后把 `NEXT_PUBLIC_APP_URL` 改成正式域名

### 6. Vercel — 配置所有环境变量
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
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager 容器 ID |

### 7. Google OAuth — 添加生产回调地址
Google Console → Credentials → 你的 OAuth client → Authorized redirect URIs，添加：
```
https://yourdomain.com/api/auth/callback/google
```

---

## 邮件 (Email)

### 8. Resend — 验证发件域名
- Resend → Domains → Add Domain → 按提示添加 DNS 记录
- 验证通过后更新 `.env` 和 Vercel 环境变量：
  ```
  FROM_EMAIL="BirthdayVid <noreply@yourdomain.com>"
  ADMIN_EMAIL="zsyoscar@gmail.com"
  ```

### 9. 邮件按钮链接 — 改为动态 URL
管理员通知邮件里"View in Admin Dashboard →"按钮目前是硬编码的占位 URL。

**文件：** `src/lib/email.ts` 第 41 行
```ts
// 改为：
href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin"
```

### 10. 邮件内容国际化（可选）
目前通知邮件内容是纯英文 HTML。如果中文用户也会收到邮件，考虑根据用户语言发对应语言的邮件内容。
**文件：** `src/lib/email.ts`

---

## 表单 & 内容 (Form & Content)

### 11. 移除表单测试预填数据
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

### 12. 检查并更新表单 placeholder 提示文字
目前部分输入框的 hint text 是英文示例（"e.g. Sophie"、"e.g. Blue"）。
检查 `src/messages/en.json` 和 `src/messages/zh.json` 的 `orderFlow.form` 部分，
确认措辞自然、符合目标用户（北美华人）的表达习惯。

---

## 国际化 (i18n)

### 13. 我的订单页面 — 补充中文翻译
`src/app/[locale]/orders/page.tsx` 目前有几处硬编码英文：
- `"order" / "orders"` 订单数量
- `"Create your first personalised video!"`
- `"Create a Video"` 按钮
- `` `For ${formData.subjectName}` ``

需要迁移到 `en.json` / `zh.json`。

---

## 页面 & 法律 (Pages & Legal)

### 14. 补充隐私政策 & 服务条款页面
页脚的「Privacy」「Terms」「Contact」三个链接目前是 `href="#"`（空链接）。
上线前至少需要有简单的隐私政策和服务条款页面，COPPA 合规也有此要求。

**文件：** `src/app/[locale]/page.tsx`（footer 部分）
需新建页面：
- `src/app/[locale]/privacy/page.tsx`
- `src/app/[locale]/terms/page.tsx`
- `src/app/[locale]/contact/page.tsx`（或直接链接到邮箱 `mailto:`）

---

## SEO & 品牌

### 15. Open Graph / 社交分享图
目前只有基础 `<title>` 和 `<description>`，没有 `og:image`（社交分享时无预览图）。
建议添加：
- 一张 1200×630 的品牌封面图
- `src/app/[locale]/layout.tsx` 里补充 `openGraph` metadata

### 16. Favicon
检查是否有品牌 favicon（目前使用 Next.js 默认图标）。
放入 `public/favicon.ico` 或 `public/favicon.svg` 即可。

---

## Apple 登录（可选）

### 17. Apple OAuth 配置
目前 Apple 登录已条件性跳过（`AUTH_APPLE_ID` 未设置）。
如果上线时要支持 Apple 登录，需要：
- Apple Developer 账号 → 创建 App ID + Services ID
- 将 `AUTH_APPLE_ID` 和 `AUTH_APPLE_SECRET` 填入 `.env` 和 Vercel

---

## 安全 & 稳定性

### 18. 文件上传 — 内容类型校验
目前 `/api/upload` 只检查文件大小，未校验实际文件内容（MIME type 可被伪造）。
上线前建议在服务端做基础的文件头（magic bytes）校验，防止上传恶意文件。
**文件：** `src/app/api/upload/route.ts`

### 19. Supabase Storage — 确认 CORS 配置
切换到生产域名后，检查 Supabase Storage 的 CORS 设置是否允许新域名的请求。
Supabase 控制台 → Storage → 设置。
