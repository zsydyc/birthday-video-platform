import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";

const content = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: August 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: `By using BirthdayVid ("the Service"), you agree to these Terms of Service. If you do not agree, please do not use the Service.`,
      },
      {
        heading: "What We Provide",
        body: `BirthdayVid creates personalised short videos for birthdays and special occasions. During the current MVP / free-trial period, videos are provided at no charge to invited users. We reserve the right to introduce paid plans in the future, with advance notice.`,
      },
      {
        heading: "Your Account",
        body: `You must sign in with a valid Google account to place an order. You are responsible for maintaining the security of your account. Notify us immediately if you suspect unauthorised access.`,
      },
      {
        heading: "Content You Submit",
        body: `You retain ownership of all photos, audio clips, and other material you upload ("Your Content"). By submitting Your Content, you grant us a limited, non-exclusive licence to use it solely for the purpose of producing your video. We will not use Your Content for any other purpose. See our Privacy Policy for details on retention and deletion.`,
      },
      {
        heading: "Content Standards",
        body: `You must not upload content that:
• Infringes any third-party copyright, trademark, or other intellectual property right
• Depicts illegal activity or explicit/adult material
• Contains personal data of third parties without their consent
• Violates any applicable law

We reserve the right to refuse or remove orders that violate these standards.`,
      },
      {
        heading: "Children's Content",
        body: `If your video features a child under 13, you confirm that you are the child's parent or legal guardian and consent to providing their information for video production. This is required by the Children's Online Privacy Protection Act (COPPA) and similar laws.`,
      },
      {
        heading: "Delivery and Turnaround",
        body: `We aim to deliver completed videos within 24–72 hours of order submission. Actual turnaround may vary. We will notify you by email when your video is ready for preview.`,
      },
      {
        heading: "Intellectual Property of Delivered Videos",
        body: `Once delivered, you may download and share your video for personal, non-commercial use. The video may incorporate original artistic elements created by our team, which remain our intellectual property. You may not resell or commercially exploit delivered videos without written permission.`,
      },
      {
        heading: "Original Characters Only",
        body: `All characters, stories, and visual elements in our videos are original creations. We do not reproduce copyrighted characters (such as cartoon or film characters). Requests referencing specific copyrighted IP will be fulfilled with original alternatives.`,
      },
      {
        heading: "Disclaimer of Warranties",
        body: `The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability or that the Service will meet every expectation. To the maximum extent permitted by law, we disclaim all implied warranties.`,
      },
      {
        heading: "Limitation of Liability",
        body: `To the fullest extent permitted by law, BirthdayVid's total liability to you for any claim arising from use of the Service shall not exceed the amount you paid for the relevant order (which during the free-trial period is zero).`,
      },
      {
        heading: "Changes to These Terms",
        body: `We may update these Terms at any time. We will update the date at the top of this page. Continued use of the Service after changes constitutes acceptance of the revised Terms.`,
      },
      {
        heading: "Contact",
        body: `Questions? Email us at thinkotechnology@gmail.com.`,
      },
    ],
  },
  zh: {
    title: "服务条款",
    updated: "最后更新：2026年8月",
    sections: [
      {
        heading: "条款接受",
        body: `使用 BirthdayVid（以下简称"本服务"）即表示您同意本服务条款。如不同意，请停止使用本服务。`,
      },
      {
        heading: "服务内容",
        body: `BirthdayVid 为生日及特殊纪念日提供个性化短视频制作服务。当前 MVP / 免费试用阶段，受邀用户可免费使用。我们保留在未来推出付费方案的权利，届时将提前通知用户。`,
      },
      {
        heading: "您的账户",
        body: `下单需使用有效的 Google 账户登录。您有责任维护账户安全。如发现未经授权的访问，请立即联系我们。`,
      },
      {
        heading: "您提交的内容",
        body: `您上传的照片、音频及其他素材（以下简称"您的内容"）归您所有。提交内容即表示您授予我们有限的、非独占的许可，仅用于制作您的专属视频。我们不会将您的内容用于任何其他目的。具体的保存与删除说明，请参阅隐私政策。`,
      },
      {
        heading: "内容规范",
        body: `您不得上传以下内容：
• 侵犯他人版权、商标或其他知识产权的内容
• 涉及违法行为或包含成人/露骨内容
• 未经当事人同意而包含其个人信息的内容
• 违反任何适用法律的内容

我们保留拒绝或撤销违规订单的权利。`,
      },
      {
        heading: "儿童内容",
        body: `若您的视频以13岁以下儿童为主角，您需确认自己是该儿童的父母或法定监护人，并同意提供其相关信息用于视频制作。这是《儿童在线隐私保护法》（COPPA）等相关法规的要求。`,
      },
      {
        heading: "交付与制作周期",
        body: `我们力争在收到订单后24至72小时内完成视频制作。实际时间可能有所浮动。视频完成后，我们将通过邮件通知您预览。`,
      },
      {
        heading: "交付视频的知识产权",
        body: `视频交付后，您可下载并将其用于个人、非商业用途分享。视频中由我们团队创作的原创艺术元素仍属我们的知识产权。未经书面许可，您不得将交付的视频用于转售或商业用途。`,
      },
      {
        heading: "原创角色声明",
        body: `我们视频中的所有角色、故事和视觉元素均为原创。我们不复制任何受版权保护的角色（如卡通或电影形象）。涉及特定版权 IP 的请求将以原创替代方案完成。`,
      },
      {
        heading: "免责声明",
        body: `本服务按"现状"提供，不附任何明示或默示保证。我们不保证服务不间断或完全满足每位用户的期望。在法律允许的最大范围内，我们免除一切默示保证。`,
      },
      {
        heading: "责任限制",
        body: `在法律允许的最大范围内，BirthdayVid 因服务引起的任何索赔，其总赔偿责任不超过您为相关订单实际支付的金额（免费试用期间为零）。`,
      },
      {
        heading: "条款变更",
        body: `我们可能随时更新本条款，并在本页顶部更新日期。继续使用本服务即视为接受修订后的条款。`,
      },
      {
        heading: "联系我们",
        body: `如有疑问，请发送邮件至 thinkotechnology@gmail.com。`,
      },
    ],
  },
};

export default async function TermsPage({
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
