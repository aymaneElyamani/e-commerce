// Import necessary components
"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import useCartStore from "@/store/useCartStore";
import Loading from "@/app/loading";
import axios from "axios";
import CardProduct from "@/components/cardProduct";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { SIZES } from "@/constants";


export default function ProductPage() {
  const params = useParams();
  const id = params.id?.toString();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? "black");

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { addProduct } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const router = useRouter()

  const {isAuthenticated} = useAuthStore()
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

  // Fetch product details
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch(() => {
        toast.error("Network error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Fetch recommended products based on category
  useEffect(() => {
    if (product?.category) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/recommande?category=${product.category}`)
        .then((response) => {
          setRecommendedProducts(response.data);
        })
        .catch(() => {
          toast.error("Failed to fetch recommended products");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [product?.category]);

  // Loading state
  if (loading || !product) {
    return <Loading />;
  }

  // Handle adding product to the cart
  const handleAdd = () => {

    if(!isAuthenticated){
      toast.info("You should login first")
      router.push("/login")

      return;
    }
    const request: AddToCardType = {
      idCart : null,
      color: selectedColor,
      idProduct: product?.id,
      name: product?.name,
      price : product.price,
      quantity:quantity
      , image_cover : product.image_cover , size :selectedSize
    };
    addProduct(request);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Carousel */}
        
            <div className="flex w-full gap-4">
      {/* Vertical list of thumbnails */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px]">
        {(product.image_details || []).map((img: string, index: number) => (
          <div
            key={index}
            className={`relative w-24 h-24 rounded overflow-hidden border-2 cursor-pointer ${
              selectedImage === index ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={img}
              alt={`Product image ${index + 1}`}
              className="object-cover w-full h-full rounded"
            />
          </div>
        ))}
      </div>

      {/* Selected image display */}
      <div className="relative flex-1 min-w-[300px] max-w-[700px] h-[400px] rounded overflow-hidden border">
        <img
          src={product.image_details[selectedImage]}
          alt="Selected"
          className="object-contain w-full h-full rounded"
        />
        <button
          className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
          onClick={() => setFullscreenImage(product.image_details[selectedImage])}
        >
          <Maximize2 className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogTitle />
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-background">
          {fullscreenImage && (
            <img
              src={fullscreenImage}
              alt="Fullscreen"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl  mb-2 text-primary">{product.name}</h1>
          <p className="text-primary">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            {
              product.discount_percentage &&
 <span className="text-xl text-muted-foreground font-semibold line-through">
              ${product.price}
            </span>
            }
              
            <span className="text-xl text-primary font-semibold">
              ${ product.discount_percentage ? (product.price - product.price * product.discount_percentage/100).toFixed(2) : product.price}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            {product.colors.map((color) => (
              <div
              onClick={()=>  setSelectedColor(color)}
                key={color}
                style={{ backgroundColor: color }}
                className={`h-5 w-5 cursor-pointer  ${selectedColor == color ? "border-primary border-2 " : "border-none"}`}
              />
            ))}
          </div>

          <div className="mb-4">
            <p className="text-sm text-primary mb-3">
              Choose Size
            </p>

            <div className=" flex gap-x-2">
             { SIZES.map((ele , index)=>{
              return <h1 key = {index} onClick={()=>setSelectedSize(ele)} className={`px-2 py-2 ${selectedSize == ele ? "bg-primary text-primary-foreground" : "text-primary bg-background"} border-primary border  w-20 text-center cursor-pointer`}>
                {ele}
              </h1>
             })}
            </div>
        
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm text-primary">Quantity</label>
            <Button
              variant="outline"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>
            <span className="w-6 text-center">{quantity}</span>
            <Button variant="outline" onClick={() => setQuantity((q) => q + 1)}>
              +
            </Button>
          </div>

          <Button onClick={handleAdd} className=" mt-5 bg-transparent border border-primary text-primary w-full hover:bg-primary hover:text-primary-foreground">Ajouter</Button>
          {/* <Button className="ml-2">Checkout</Button> */}
        </div>
      </div>

      {/* Recommended Products */}
      <h2 className="text-4xl  mt-14 mb-10 text-center text-primary ">You might also like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product, index) => (
          <CardProduct product={product} key={index} />
        ))}
      </div>

      {/* Promo Section */}


      {/* Brand Logos */}
     {/* Brand Placeholders */}
<div className="text-center mt-12">
  <h3 className="text-xl font-bold mb-6">They Trusted Us</h3>
  <div className="flex flex-wrap justify-center gap-8">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
      <div 
        key={item}
        className="flex items-center justify-center w-16 h-16 bg-muted rounded-full"
      >
        <svg 
          className="w-8 h-8 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
