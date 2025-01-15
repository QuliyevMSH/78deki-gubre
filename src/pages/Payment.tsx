import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/types";

type PaymentMethod = 'online' | 'cash';

export default function Payment(): JSX.Element {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Zəhmət olmasa daxil olun",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        total_amount: total,
        shipping_address: formData.address,
        phone: formData.phone,
        email: formData.email,
        status: paymentMethod === 'online' ? 'paid' : 'pending'
      });

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Sifarişiniz qəbul edildi",
      });

      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Sifariş yaradılmadı",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (items.length === 0) {
    navigate("/");
    return <></>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">Ödəniş məlumatları</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sifariş məlumatları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.products?.name} x {item.quantity}</span>
                  <span>{formatPrice(item.products?.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Cəmi</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ödəniş üsulu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup
                defaultValue="online"
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Onlayn ödəmə</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Qapıda ödəmə</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'online' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Kart nömrəsi</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Bitmə tarixi</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="text"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        required
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardHolder">Kart sahibinin adı</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      type="text"
                      required
                      value={formData.cardHolder}
                      onChange={handleChange}
                      placeholder="Ad Soyad"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email ünvanınız"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Telefon nömrəniz"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Çatdırılma ünvanı</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Tam ünvan"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Gözləyin..." : "Sifarişi təsdiqlə"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
