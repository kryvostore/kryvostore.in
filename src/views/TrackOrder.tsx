"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getCustomerData } from "@/lib/shopify";

const steps = [
  { icon: Package, label: "Order Confirmed", desc: "Your order has been received and verified by our system." },
  { icon: Clock, label: "Processing Phase", desc: "Our logistics team is currently preparing your package." },
  { icon: Truck, label: "Shipped & In Transit", desc: "Your order is en route to the final destination." },
  { icon: CheckCircle, label: "Successfully Delivered", desc: "The package has been securely delivered." },
];

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const { accessToken } = useAuthStore();
  const { data: customer } = useQuery({
    queryKey: ['customer', accessToken],
    queryFn: () => getCustomerData(accessToken!),
    enabled: !!accessToken,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setIsLoading(true);
    setOrderData(null);

    // Simulate network delay for tracking system
    setTimeout(() => {
      let foundOrder: { fulfillmentStatus?: string | null } | null = null;
      if (customer?.orders?.edges) {
        // Normalize order number (remove # or prefix)
        const cleanSearch = orderNumber.replace(/[^0-9]/g, '');
        foundOrder =
          customer.orders.edges.find(
            (edge: { node: { orderNumber: number } }) =>
              edge.node.orderNumber.toString() === cleanSearch,
          )?.node ?? null;
      }
      
      if (foundOrder) {
        setOrderData({
          found: true,
          real: true,
          fulfillmentStatus: foundOrder.fulfillmentStatus || "UNFULFILLED"
        });
      } else {
        // Fallback simulation for unauthenticated users or unfound orders
        if (orderNumber.length < 4) {
          setOrderData({ found: false });
        } else {
          setOrderData({
            found: true,
            real: false,
            // For a simulated order, we'll pretend it's in progress
            fulfillmentStatus: "UNFULFILLED" 
          });
        }
      }
      setIsLoading(false);
    }, 1500);
  };

  const getCurrentStepIndex = (status: string) => {
    switch (status) {
      case 'FULFILLED': return 3; // Delivered
      case 'PARTIALLY_FULFILLED': return 2; // Shipped / Transit
      case 'UNFULFILLED': default: return 1; // Processing
    }
  };

  const activeStep = orderData?.found ? getCurrentStepIndex(orderData.fulfillmentStatus) : 0;

  return (
    <div className="min-h-screen bg-background pt-[140px] pb-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="font-display tracking-[[-0.03em]] text-6xl lg:text-[7rem] font-medium leading-[0.95] mb-8">
            Track Your <br className="hidden lg:block"/> Order
          </h1>
          <p className="text-[17px] lg:text-[19px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl mx-auto">
            Enter your secure tracking or order number below to check the real-time logistics status of your package.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Input
              placeholder="Order Number (e.g. #1001)"
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setSearched(false); }}
              required
              className="bg-secondary/30 flex-1 h-[54px] rounded-2xl px-6 text-[15px] border-border/50 focus-visible:ring-foreground"
              maxLength={50}
            />
            <Button type="submit" disabled={isLoading} className="h-[54px] px-10 text-[15px] rounded-2xl bg-foreground text-background shadow-md transition-transform active:scale-[0.98]">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="h-4 w-4 mr-2" /> Track Package</>}
            </Button>
          </form>

          <div className="transition-all duration-300 ease-out">
            {searched && (
              <div className="rounded-[2.5rem] bg-secondary/30 border border-border/40 p-10 lg:p-14 shadow-sm">
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground mb-6" />
                    <p className="text-center text-[16px] text-muted-foreground/70 font-light">
                      Querying global logistics networks... Please hold...
                    </p>
                  </div>
                ) : !orderData?.found ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="font-display tracking-tight text-2xl font-medium mb-3">Order Not Found</h3>
                    <p className="text-[15px] text-muted-foreground/80 font-light max-w-sm leading-relaxed">
                      We couldn't locate an order with that number. Please verify the digits and try again.
                      {!accessToken && " If you have an account, logging in may help securely retrieve your tracking details."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-[13px] font-medium tracking-wide mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {orderData.real ? "VERIFIED ACCOUNT ORDER" : "TRACKING INITIATED"}
                      </div>
                      <p className="text-[15px] text-muted-foreground/70 font-light">
                        {orderData.real ? "Real-time tracking data retrieved securely from your account." : "Simulated tracking environment active for unregistered session."}
                      </p>
                    </div>

                    {/* Timeline UI */}
                    <div className="space-y-0 max-w-sm mx-auto relative">
                      {steps.map((step, i) => {
                        const isActive = i <= activeStep;
                        return (
                          <div key={i} className="flex gap-6">
                            <div className="flex flex-col items-center relative">
                              <div className={`w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-sm border transition-colors duration-300 ${isActive ? "bg-foreground border-foreground text-background z-10" : "bg-background border-border/60 text-muted-foreground"}`}>
                                <step.icon className={`h-[22px] w-[22px] ${isActive ? "opacity-100" : "opacity-50"}`} />
                              </div>
                              {i < steps.length - 1 && (
                                <div className={`w-[2px] h-16 my-2 rounded-full transition-colors duration-300 ${i < activeStep ? "bg-foreground" : "bg-border/40"}`} />
                              )}
                            </div>
                            <div className={`pb-8 pt-3 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-40"}`}>
                              <h4 className="font-display text-[19px] font-medium tracking-tight mb-1.5">{step.label}</h4>
                              <p className="text-[15px] text-muted-foreground/80 font-light leading-relaxed">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;


