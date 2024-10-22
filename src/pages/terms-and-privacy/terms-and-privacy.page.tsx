import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import termsAndPrivacyContent from "./terms-and-privacy-data.json";

export const SectionTitle = ({ title }) => (
  <h4 className="font-semibold leading-7 text-lg text-text_04">{title}</h4>
);

export const SectionSubtitle = ({ subtitle }) => (
  <p className="text-sm font-normal text-text_subtitle">{subtitle}</p>
);

export const BodyText = ({ children }) => (
  <p className="text-sm font-normal text-text_05">{children}</p>
);

export const List = ({ items }) => (
  <ul className="text-sm leading-6 font-normal text-text_05 list-disc pl-6 ">
    {items.map((item, index) => (
      <li key={index}>
        <span className="relative left-[-5px]">{item}</span>
      </li>
    ))}
  </ul>
);

export default function TermsAndPrivacyPage() {
  const { pageTitle, sections } = termsAndPrivacyContent;

  return (
    <div className="flex flex-col w-full items-center">
      <div className="border-l border-r border-input max-w-[57rem] shadow-left-right bg-background">
        <div className="flex flex-col p-8 border-b  border-input w-full ">
          <TypographyH1 className="text-primary text-[1.75rem] leading-[2.75rem] font-bold tracking-wide">
            {pageTitle.title}
          </TypographyH1>
          <TypographyMuted className="text-text_03 font-normal">
            {pageTitle.description}
          </TypographyMuted>
        </div>
        <div className="flex flex-col p-8 pt-6 gap-y-8 w-full  flex-1">
          {sections.map((section, index) => (
            <section key={index} className="flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-1">
                <SectionTitle title={section.title} />
                {section.subtitle && <SectionSubtitle subtitle={section.subtitle} />}
              </div>
              {section.body.map((bodyText, idx) => (
                <BodyText key={idx}>{bodyText}</BodyText>
              ))}
              {section.list && <List items={section.list} />}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
