import apiDocumentationContent from "./api-documentation-data.json";

interface PageTitleProps {
  title: string;
  description: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => (
  <div className="flex flex-col p-8 pr-0 border-b border-input w-full gap-y-1">
    <h1 className="text-foreground text-[1.75rem] leading-[2.75rem] font-bold tracking-wide">
      {title}
    </h1>
    <p className="text-sm text-text_03 font-light">{description}</p>
  </div>
);

interface SectionProps {
  title?: string;
  subtitle?: string;
  body?: string;

  subtitle2?: string;
  body2?: string;
}

export const Section: React.FC<SectionProps> = ({ title, subtitle, subtitle2, body, body2 }) => (
  <section className="flex flex-col gap-y-[23px] relative top-[-1px]">
    {title && (
      <div className="flex flex-col gap-y-2">
        <h4 className="text-foreground text-[18px] leading-7">{title}</h4>
        {subtitle && <p className="text-sm font-light text-text_subtitle">{subtitle}</p>}
      </div>
    )}
    {body && <p className="text-sm font-light">{body}</p>}
    {subtitle2 && (
      <div className="flex flex-col gap-y-2">
        <p className="text-text_subtitle_bright font-medium tracking-wide text-sm">{subtitle2}</p>
        {body2 && <p className="text-sm font-light">{body2}</p>}
      </div>
    )}
  </section>
);

interface AsyncParameter {
  name: string;
  description: string;
}

interface AsyncParametersProps {
  asyncParameters: AsyncParameter[];
}

export const AsyncParameters: React.FC<AsyncParametersProps> = ({ asyncParameters }) => (
  <div className="flex items-top gap-x-[9px] relative top-[-10px]">
    <div className="flex flex-col items-end gap-y-4 max-w-max">
      {asyncParameters.map((param, idx) => (
        <div
          key={idx}
          className="px-2 py-1.5 font-mono text-sm font-light rounded-md text-text_brand bg-container_brand_darker"
        >
          {param.name}
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-y-4 px-[1px]">
      {asyncParameters.map((_, idx) => (
        <span key={idx} className="flex h-8 items-center leading-5 font-light text-text_05">
          :
        </span>
      ))}
    </div>
    <div className="flex flex-col gap-y-4">
      {asyncParameters.map((param, idx) => (
        <span key={idx} className="flex items-center text-sm text-text_05 sm:h-8">
          {param.description}
        </span>
      ))}
    </div>
  </div>
);

interface MarkupProps {
  subtitle: string;
  content: string;
}

export const MarkupSection: React.FC<MarkupProps> = ({ subtitle, content }) => (
  <div className="flex flex-col px-5 pt-5 pb-6 bg-container_same_bg rounded-[10px]">
    <p className="text-sm font-light text-text_subtitle pb-3">{subtitle}</p>
    <p className="text-sm font-light font-mono text-text_05">{content}</p>
  </div>
);

export default function ApiDocumentationPage() {
  const renderSection = (section: any) => (
    <>
      {section.title && (
        <Section title={section.title} subtitle={section.subtitle} body={section.body} />
      )}
      {section.subtitle2 && <Section subtitle2={section.subtitle2} body2={section.body2} />}
      {section.asyncParameters && <AsyncParameters asyncParameters={section.asyncParameters} />}
      {section.markup && (
        <MarkupSection subtitle={section.markup.subtitle} content={section.markup.content} />
      )}
    </>
  );

  return (
    <div className="flex flex-col w-full items-center ">
      <div className="border-l border-r border-input max-w-[57rem] shadow-left-right bg-background">
        <PageTitle
          title={apiDocumentationContent.intro.title}
          description={apiDocumentationContent.intro.description}
        />

        <div className="flex flex-col p-8 gap-y-8 w-full flex-1">
          {apiDocumentationContent.sections.map((section, index) => (
            <div key={index} className="text-text_05_07">
              {renderSection(section)}
              {section.group && (
                <div className="pl-5 pr-4 pt-6 pb-5 flex flex-col gap-y-8 bg-container_same_bg rounded-[10px] text-text_05_07">
                  {section.group.map((innerSection, index) => (
                    <div key={index}>{renderSection(innerSection)}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
