import { SVGProps } from "react";
import Image from "next/image";
import dashboardSrc from "./Dashboard.svg";
import usersSrc from "./Users.svg";
import clientsSrc from "./Clients.svg";
import billingSrc from "./Billing.svg";
import subscriptionsSrc from "./Subscriptions.svg";
import messagingSrc from "./Messaging.svg";
import reportingSrc from "./Reporting.svg";
import exceptionsSrc from "./Exceptions.svg";

type IconSrc = typeof dashboardSrc | typeof usersSrc | typeof clientsSrc | typeof billingSrc | typeof subscriptionsSrc | typeof messagingSrc | typeof reportingSrc | typeof exceptionsSrc;

function SVGWrapper({iconSrc, alt}: {iconSrc: IconSrc, alt: string}) {
  return (
    <Image
      className="mr-4"
      src={iconSrc}
      alt={alt}
      width={20}
      height={20}
    />
  );
}

function DashboardIcon() {
  return <SVGWrapper iconSrc={dashboardSrc} alt="Dashboard" />;
}

function UsersIcon() {
  return <SVGWrapper iconSrc={usersSrc} alt="Users" />;
}

function ClientsIcon() {
  return <SVGWrapper iconSrc={clientsSrc} alt="Clients" />;
}

function BillingIcon() {
  return <SVGWrapper iconSrc={billingSrc} alt="Billing" />;
}

function SubscriptionsIcon() {
  return <SVGWrapper iconSrc={subscriptionsSrc} alt="Subscriptions" />;
}

function MessagingIcon() {
  return <SVGWrapper iconSrc={messagingSrc} alt="Messaging" />;
}

function ReportingIcon() {
  return <SVGWrapper iconSrc={reportingSrc} alt="Reporting" />;
}

function ExceptionsIcon() {
  return <SVGWrapper iconSrc={exceptionsSrc} alt="Exceptions" />;
}

export { DashboardIcon, UsersIcon, ClientsIcon, BillingIcon, SubscriptionsIcon, MessagingIcon, ReportingIcon, ExceptionsIcon };
