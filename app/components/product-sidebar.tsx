import { PRODUCTS, type Conversation, type Product } from "@/app/lib/types";

export function ProductSidebar({
  conversations,
  selectedProduct,
  onProductSelect,
}: {
  conversations: Conversation[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
}) {
  const products = Object.keys(PRODUCTS) as Product[];
  const counts = Object.fromEntries(
    products.map((p) => [p, conversations.filter((c) => c.product === p).length]),
  ) as Record<Product, number>;

  return (
    <aside className="flex w-52 flex-none flex-col overflow-hidden border-r border-border bg-card">
      <div className="border-b border-border p-3.5">
        <h3 className="text-sm font-semibold text-foreground">Products</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {conversations.length} total conversations
        </p>
      </div>

      <div className="px-2.5 pt-2.5 pb-1.5">
        <button
          type="button"
          onClick={() => onProductSelect(null)}
          className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
            selectedProduct === null
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-background hover:bg-muted"
          }`}
        >
          <span>All Products</span>
          <span className="text-xs font-medium">{conversations.length}</span>
        </button>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1">
        {products.map((product) => {
          const info = PRODUCTS[product];
          const on = selectedProduct === product;
          return (
            <button
              key={product}
              type="button"
              onClick={() => onProductSelect(product)}
              className={`flex h-auto w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                on ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className="size-2 flex-none rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <span className="truncate">{info.name}</span>
              </span>
              <span className="ml-2 flex-none text-xs font-medium">
                {counts[product]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-1 border-t border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Open</span>
          <span className="font-medium text-foreground">
            {conversations.filter((c) => c.status === "open").length}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Pending</span>
          <span className="font-medium text-foreground">
            {conversations.filter((c) => c.status === "pending").length}
          </span>
        </div>
      </div>
    </aside>
  );
}
