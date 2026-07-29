"use client";

import { ArrowLeftIcon, RadioIcon } from "lucide-react";
import Link from "next/link";
import { ChatHead } from "@/app/components/chat-head";
import { demoContacts } from "@/app/lib/demo-contacts";
import { PRODUCTS, type Product } from "@/app/lib/types";

const productList = Object.keys(PRODUCTS) as Product[];

export default function WidgetDemoPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex flex-none items-center justify-between gap-4 border-b border-border bg-card px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <RadioIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg leading-tight font-bold text-foreground">
              Live widget demo
            </h1>
            <p className="text-xs leading-tight text-muted-foreground">
              Each card below is a stand-in storefront with its own chat head.
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to inbox
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Open the inbox in another tab, click a chat bubble below, and send a message as that
          customer — it lands in the inbox live. Reply from the inbox and the reply shows up back
          here, in the same chat head.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {productList.map((product) => {
            const info = PRODUCTS[product];
            const contact = demoContacts[product];
            return (
              <div
                key={product}
                className="relative flex h-72 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <div
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: info.color }}
                >
                  <span className="size-2 rounded-full bg-white/80" />
                  {info.name}
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{contact.tagline}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{contact.site}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Visiting as <span className="font-medium text-foreground">{contact.name}</span>
                  </p>
                </div>

                <ChatHead product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
