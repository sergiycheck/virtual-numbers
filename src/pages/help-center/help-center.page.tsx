import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactUsButton from "@/components/help-center/contact-us-button";
import { useRef, useState } from "react";
import ContactUsForm from "@/components/help-center/contact-us-form";
import { HELP_CENTER_DATA } from "./help-center-data";
import { Icons } from "@/components/ui/icons";
import clsx from "clsx";
import { cn } from "@/lib/utils";

export interface FAQCategory {
  id: string;
  name: string;
  questions: FAQQuestion[];
}

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

export default function HelpCenterPage() {
  const [showFrom, setShowForm] = useState(false);

  const menuRef = useRef<HTMLDivElement[]>([]);
  const [activeLeftMenuItemId, setActiveLeftMenuItemId] = useState<string>("");

  const [activeValue, setActiveValue] = useState<string>("");

  const handleMenuClick = (id: string) => {
    const top = menuRef.current[id]?.offsetTop;

    window?.scrollTo({
      top: top - 200,
      behavior: "smooth",
    });
  };

  const handleMenuItemClick = (categoryId: string, subcategoryId: string) => {
    handleMenuClick(categoryId);
    setActiveLeftMenuItemId(categoryId);
    setActiveValue(subcategoryId);

    const currentSelector = `[data-right-acc-sub-id="${categoryId}-${subcategoryId}"]`;

    const triggerRightAccording = document.querySelector(currentSelector);

    if (triggerRightAccording) {
      triggerRightAccording.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  return (
    <div id="help-center-parent-scroll" className="flex flex-col w-full items-center">
      <div className="border-l border-r border-input max-w-[57rem] shadow-left-right bg-background">
        <div
          className="flex flex-col pl-[32px]  pt-7 pb-7 border-b 
         border-input w-full "
        >
          <TypographyH1 className="text-primary text-[1.75rem] leading-[2.75rem] font-bold">
            Help Center
          </TypographyH1>
          <TypographyMuted className="text-text_03 font-normal">
            Elementum facilisis nunc in ultricies nibh. Est mattis nisl id in consequat sed.
          </TypographyMuted>
        </div>
        <div className="flex flex-row p-8 sm:gap-x-8 w-full flex-1">
          <div className="relative">
            <div className="hidden sm:flex flex-col gap-y-6 max-w-[20.625rem] sticky top-[60px]">
              {HELP_CENTER_DATA.map((category) => {
                const { name, questions } = category;
                const totalQuestions = questions.length;
                const categoryId = category.id;

                return (
                  <section className="flex flex-col gap-y-3" key={categoryId}>
                    <div
                      data-id={categoryId}
                      onClick={() => {
                        handleMenuClick(categoryId);
                        setActiveLeftMenuItemId(categoryId);
                      }}
                      className={clsx(
                        `p-4 flex items-center bg-container_dark rounded-lg 
                  cursor-pointer hover:ring-1 hover:ring-text_brand`,
                        activeLeftMenuItemId === categoryId && "ring-1 ring-text_brand"
                      )}
                    >
                      <Icons.Stars className="h-4 w-4" />
                      <p
                        className={cn(
                          "ml-3 mr-2.5 text-base leading-5 font-semibold text-foreground",
                          activeLeftMenuItemId !== categoryId && "text-text_01"
                        )}
                      >
                        {name}
                      </p>
                      <p className="flex items-center rounded-full bg-container_light ml-auto py-[2px] px-1.5 text-xs leading-4 font-semibold text-text_01">
                        {totalQuestions}
                      </p>
                    </div>
                    <div className="pl-6">
                      <ul
                        className={cn(
                          "text-sm font-medium text-foreground space-y-2",
                          activeLeftMenuItemId !== categoryId && "text-text_01"
                        )}
                      >
                        {questions.map((question: FAQQuestion) => {
                          const subcategoryId = question.id;
                          return (
                            <li
                              onClick={() => {
                                handleMenuItemClick(categoryId, subcategoryId);
                              }}
                              key={subcategoryId}
                              className="flex items-center gap-x-2 cursor-pointer tracking-[0.42px]"
                            >
                              <Icons.ListImage
                                className={cn(
                                  "h-4 w-4 fill-current text-icond_light_2 flex-shrink-0"
                                )}
                              />
                              <span className="text-ellipsis overflow-hidden text-nowrap">
                                {question.question}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-y-6">
            {HELP_CENTER_DATA.map((category) => {
              const { name, questions } = category;
              const categoryId = category.id;

              return (
                <section className="flex flex-col" key={categoryId}>
                  <div
                    ref={(el: HTMLDivElement) => {
                      menuRef.current[categoryId] = el;
                    }}
                    data-id={categoryId}
                    className={cn(
                      "text-text_01 text-xl font-bold mb-4",
                      categoryId == activeLeftMenuItemId && "text-foreground"
                    )}
                  >
                    {name}
                  </div>
                  <Accordion
                    type="single"
                    value={activeValue}
                    collapsible
                    onValueChange={(value) => {
                      setActiveValue(value);
                    }}
                    className="w-full dark:bg-container_same_bg rounded-lg border-input border"
                  >
                    {questions.map((question: FAQQuestion) => {
                      const subcategoryId = question.id;
                      return (
                        <AccordionItem
                          key={`${categoryId}-${subcategoryId}`}
                          value={`${subcategoryId}`}
                          className="px-6 data-[state=open]:bg-[rgba(204,199,196,0.03)] last:border-b-0"
                        >
                          <AccordionTrigger
                            data-right-acc-sub-id={`${categoryId}-${subcategoryId}`}
                            className="hover:no-underline text-sm font-semibold tracking-[0.42px] text-text_subtitle 
                          data-[state=open]:text-text_title text-left"
                            onClick={() => {
                              handleMenuClick(categoryId);
                              setActiveLeftMenuItemId(categoryId);
                              setActiveValue(subcategoryId);
                            }}
                          >
                            {question.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-text_faq_answer font-normal text-[0.8125rem] leading-5 tracking-normal relative top-[-3px] ">
                            {question.answer}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </section>
              );
            })}
          </div>
        </div>
      </div>
      <ContactUsButton
        onButtonClick={() => {
          setShowForm(true);
        }}
      />
      <ContactUsForm
        show={showFrom}
        close={() => {
          setShowForm(false);
        }}
      />
    </div>
  );
}
