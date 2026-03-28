import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface FavoritesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FavoritesDrawer = ({ open, onOpenChange }: FavoritesDrawerProps) => {
  const { items, removeItem } = useFavoritesStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  const handleAddToCart = async (item: any) => {
    const variant = item.product.node.variants.edges[0]?.node;
    if (!variant) return;

    await addItemToCart({
      product: item.product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    
    toast.success("Added to cart", { description: item.product.node.title });
    removeItem(item.variantId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background border-border/50">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display">Your Favorites</SheetTitle>
          <SheetDescription>
            {items.length === 0 
                ? "You haven't saved any items yet." 
                : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 mt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-2">Build your wishlist</p>
              <p className="text-muted-foreground text-sm max-w-[250px]">
                Tap the heart icon on any product to save it for later.
              </p>
              <Button 
                onClick={() => onOpenChange(false)} 
                variant="outline" 
                className="mt-8 rounded-full h-12 px-8"
              >
                Keep Shopping
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 min-h-0">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 group">
                    <Link 
                        to={`/product/${item.product.node.handle}`} 
                        onClick={() => onOpenChange(false)}
                        className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img 
                            src={item.product.node.images.edges[0].node.url} 
                            alt={item.product.node.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                        />
                      )}
                    </Link>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <Link 
                            to={`/product/${item.product.node.handle}`}
                            onClick={() => onOpenChange(false)}
                        >
                            <h4 className="font-medium text-[15px] truncate hover:text-foreground/80 transition-colors">
                                {item.product.node.title}
                            </h4>
                        </Link>
                        <p className="font-semibold text-foreground text-sm mt-1">
                            {item.product.node.variants.edges[0]?.node.price.currencyCode}{" "} 
                            {parseFloat(item.product.node.variants.edges[0]?.node.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={isCartLoading}
                          variant="secondary"
                          size="sm"
                          className="h-8 rounded-full text-xs font-medium bg-background border border-border/50 hover:bg-foreground hover:text-background transition-colors w-full"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                          Move to Cart
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" 
                            onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
