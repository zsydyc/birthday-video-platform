import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: August 2026",
    sections: [
      {
        heading: "Who We Are",
        body: `BirthdayVid ("we", "us", or "our") is a personalised video creation service. We create short custom videos for birthdays and special occasions. Our contact email is thinkotechnology@gmail.com.`,
      },
      {
        heading: "What We Collect",
        body: `When you place an order, we collect:
• Your name and email address (via Google Sign-In)
• Information you provide about the video subject: name, age, occasion, preferences, and any personal message
• Photos and audio clips you choose to upload as creative material
• Order status and history

We do not collect payment card details (no payment processing is active during the free-trial period).`,
      },
      {
        heading: "How We Use Your Information",
        body: `We use your information solely to:
• Create the personalised video you ordered
• Send you order status notifications by email
• Improve the quality and personalisation of our service

We do not use your information for advertising, sell it to third parties, or share it with anyone outside our production team.`,
      },
      {
        heading: "Uploaded Photos, Audio, and Other Media",
        body: `Any photos, audio clips, or other files you upload are used exclusively to produce your video. We will not:
• Reuse your uploaded content for any other purpose
• Share your media with third parties
• Use your images or audio to train AI models
• Display your uploaded content publicly

Once your order is delivered and confirmed, we will delete uploaded source files within 90 days.`,
      },
      {
        heading: "Children's Privacy (COPPA)",
        body: `Our service may involve creating videos that feature children. We collect limited information about children (name, age, photo) only with the explicit consent of a parent or legal guardian, as confirmed by the consent checkbox during checkout. We do not knowingly collect any information directly from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
      },
      {
        heading: "Data Storage and Security",
        body: `Your data is stored on Supabase (PostgreSQL database and file storage), hosted on AWS infrastructure in the United States. We use industry-standard encryption in transit (HTTPS) and at rest. Access to your data is restricted to our small team on a need-to-know basis.`,
      },
      {
        heading: "Your Rights",
        body: `You may request at any time:
• Access to the personal data we hold about you
• Correction of inaccurate data
• Deletion of your account and associated data
• A copy of your data in a portable format

To exercise any of these rights, email us at thinkotechnology@gmail.com. We will respond within 30 days.`,
      },
      {
        heading: "Cookies",
        body: `We use a single session cookie required for authentication (NextAuth.js). We also load Google Tag Manager, which may set analytics cookies. You can disable cookies in your browser settings, though this may affect sign-in functionality.`,
      },
      {
        heading: "Changes to This Policy",
        body: `We may update this policy as the service grows. We will post the updated date at the top of this page. Continued use of the service after changes constitutes acceptance of the revised policy.`,
      },
      {
        heading: "Contact",
        body: `Questions about this policy? Email us at thinkotechnology@gmail.com.`,
      },
    ],
  },
  zh: {
    title: "隐私政策",
    updated: "最后更新：2026年8月",
    sections: [
      {
        heading: "关于我们",
        body: `BirthdayVid（以下简称"我们"）是一个个性化视频制作服务平台，专为生日及特殊纪念日提供定制短视频。联系邮箱：thinkotechnology@gmail.com。`,
      },
      {
        heading: "我们收集的信息",
        body: `当您下单时，我们收集以下信息：
• 您的姓名和电子邮件（通过 Google 登录获取）
• 您填写的视频主角信息：姓名、年龄、场合、喜好及个人祝福语
• 您自愿上传的照片和音频素材
• 订单状态及历史记录

我们不收集银行卡或支付信息（免费试用期间暂无付费功能）。`,
      },
      {
        heading: "信息使用方式",
        body: `我们仅将您的信息用于以下目的：
• 制作您订购的个性化视频
• 通过电子邮件发送订单进度通知
• 改善服务质量与个性化体验

我们不会将您的信息用于广告推送、出售给第三方，或在制作团队以外的人员中共享。`,
      },
      {
        heading: "上传的照片、音频及其他素材",
        body: `您上传的任何照片、音频或其他文件，仅用于制作您的专属视频。我们承诺：
• 不将上传内容用于任何其他用途
• 不与第三方共享您的素材
• 不使用您的图片或音频训练人工智能模型
• 不公开展示您上传的任何内容

订单交付并确认完成后，我们将在90天内删除原始上传文件。`,
      },
      {
        heading: "儿童隐私保护（COPPA）",
        body: `我们的服务可能涉及以儿童为主角的视频制作。我们仅在父母或法定监护人明确同意（通过下单时的同意确认框）的前提下，收集儿童的有限信息（如姓名、年龄、照片）。我们不会直接向13岁以下儿童收集任何信息。如您认为我们无意中收集了此类信息，请立即联系我们。`,
      },
      {
        heading: "数据存储与安全",
        body: `您的数据存储于 Supabase（PostgreSQL 数据库和文件存储），托管于美国 AWS 基础设施。我们使用行业标准的传输加密（HTTPS）和静态加密。数据访问仅限于团队内部，并遵循最小权限原则。`,
      },
      {
        heading: "您的权利",
        body: `您可以随时申请：
• 访问我们持有的您的个人数据
• 更正不准确的数据
• 删除您的账户及相关数据
• 获取您数据的可携带副本

请发送邮件至 thinkotechnology@gmail.com，我们将在30天内回复。`,
      },
      {
        heading: "Cookie 使用",
        body: `我们使用一个用于登录验证的 Session Cookie（由 NextAuth.js 生成）。此外，我们加载了 Google Tag Manager，可能设置分析类 Cookie。您可以在浏览器中禁用 Cookie，但这可能影响登录功能。`,
      },
      {
        heading: "政策变更",
        body: `随着服务发展，我们可能更新本政策。更新日期将显示在本页顶部。继续使用本服务即视为接受修订后的政策。`,
      },
      {
        heading: "联系我们",
        body: `如有任何问题，请发送邮件至 thinkotechnology@gmail.com。`,
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = locale === "zh" ? content.zh : content.en;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FFF8F2] px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-[#2D2235] mb-2">{c.title}</h1>
          <p className="text-sm text-[#2D2235]/40 mb-10">{c.updated}</p>

          <div className="space-y-8">
            {c.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-[#2D2235] mb-2">
                  {section.heading}
                </h2>
                <p className="text-sm leading-relaxed text-[#2D2235]/70 whitespace-pre-line">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#F5EEE6]">
            <Link
              href={`/${locale}`}
              className="text-sm text-[#FF6B8A] hover:underline"
            >
              ← {locale === "zh" ? "返回首页" : "Back to Home"}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
