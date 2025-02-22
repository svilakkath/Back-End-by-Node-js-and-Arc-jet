import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [10, 9, 8, 7, 6, 5, 4, 3, 2];
export const sendReminders = serve(async (context) => {
  //   const { subscriptionId } = context?.requestPayload;
  const { requestPayload = {} } = context; // Ensure requestPayload is at least an empty object
  const { subscriptionId } = requestPayload;
  console.log("requestPayload,subscriptionId", subscriptionId, requestPayload);

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    // use mailer here....
    console.log("bow bow");

    return;
  }
  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `renewal date has passed subscription ${subscriptionId} stopping work flow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntileReminder(
        context,
        `Remindr ${daysBefore} days before`,
        reminderDate
      );
    }

    await triggerReminder(context, `Reminder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  console.log("fetchSubscription", subscriptionId);

  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntileReminder = async (context, label, date) => {
  console.log(`sleep until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`triggering ${label} reminder`);
    //send email sms, push notification
  });
};
