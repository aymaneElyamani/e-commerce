import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HeartIcon, LucideView, View, ViewIcon } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import Link from "next/link";


function CardProduct({ product }: { product: Product }) {
  const { addProduct } = useCartStore();

  const handleAdd = () => {
    const request: AddToCardType = {
      color : product.colors[0],
      idProduct : product.id,
      image_cover: product.image_cover,
      name : product.name,
      price : product.price,
      size : "M",
      quantity: 1,
    };

    addProduct(request);

    console.log("Add to cart:", request);
    // Here you would typically call a function to update the cart or send a request to backend
  };

  return (
    <Card
      key={product.id}
      className="w-full rounded-[10px] border border-solid border-[#00000008] shadow-[10px_10px_20px_#00000005] overflow-hidden"
    >
      <div className="relative w-full h-[250px]">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image_cover})`  }}
        />
        <div
          // variant="outline"
          // size="icon"
          className="absolute top-[15px] right-[15px] rounded-2xl  p-0 border-none"
        >
          <HeartIcon className="w-5 h-5" />
         <Link href={`/products/${product.id}`}>
    <LucideView className="w-5 h-5" />
</Link>

        </div>
      </div>

      <CardContent className="p-0">
        <div className="pt-2 px-6 pb-4">
          <h3 className="font-black text-[#337a5b] text-base tracking-[0] leading-[22.4px] font-['Lato',Helvetica]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {
                product.discount_percentage &&  <span className="opacity-50 font-normal text-[#121212] text-xs tracking-[0] leading-[16.8px] line-through font-['Lato',Helvetica]">
                ({product.price})
              </span>
              }
            
              <span className="font-bold text-[#337a5b] text-xs tracking-[0] leading-[16.8px] font-['Lato',Helvetica]">

                {product.discount_percentage  ? (product.price - product.price * product.discount_percentage/100).toFixed(2) :  product.price}
              </span>
            </div>

            <Button
              onClick={handleAdd}
              variant={"outline"}
              className={`px-6 py-2 rounded-[3px] text-xs font-black leading-[16.8px] h-auto ${
                true
                  ? "bg-[#337a5b] text-white"
                  : "border-[#337a5b99] text-[#337a5b]"
              } font-['Lato',Helvetica]`}
            >
              Add to Card
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CardProduct;
