import React from "react";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { FormattedDate, FormattedMessage, injectIntl } from "react-intl";
import { useState, useEffect } from "react";
import classNames from "classnames";

const MAX_NUMBER_OF_DAYS_IN_MONTH = 31;

 const getDeadlineMessage = (date, intl) => {
   if (!date) {
     return {
       color: "green",
       message: intl.formatMessage({
         id: "scholarship-deadline.no-expiration",
       }),
     };
   }

   const deadline = new Date(date);

   const remainingDays = differenceInCalendarDays(deadline, new Date());

   if (remainingDays >= 0 && remainingDays < MAX_NUMBER_OF_DAYS_IN_MONTH) {
     return {
       color: "yellow",
       message: intl.formatMessage(
         { id: "scholarship-deadline.remaining-days" },
         { date, days: remainingDays }
       ),
     };
   }

   const messageKey =
     remainingDays < 0
       ? "scholarship-deadline.expired"
       : "scholarship-deadline.expiration-date";
   const year =
     deadline.getFullYear() === new Date().getFullYear()
       ? undefined
       : "numeric";
   const formattedDeadline = intl.formatDate(deadline, {
     month: "long",
     day: "2-digit",
     year,
   });

   return {
     color: remainingDays < 0 ? "red" : "green",
     message: intl.formatMessage(
       { id: messageKey },
       { date, deadline: formattedDeadline }
     ),
   };
 };

const ScholarshipDeadline = ({ date, className, tag }) => {
  const Tag = tag || "div";

  const [state, seState] = useState({
    color: null,
    message: null
  })
  const intl = {
    formatMessage: FormattedMessage,
    formatDate: FormattedDate
  }
  useEffect(() => {
    seState(getDeadlineMessage(date, intl));
  }, []);

  return (
    <Tag className={className}>
      <span
        dangerouslySetInnerHTML={{ __html: state.message }}
      />
    </Tag>
  );
};

export default injectIntl(ScholarshipDeadline);
