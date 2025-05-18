// Import necessary components
"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import useCartStore from "@/store/useCartStore";
import Loading from "@/app/loading";
import axios from "axios";
import CardProduct from "@/components/cardProduct";
import { Carousel } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

// Import the ShadCN Carousel component

// // Product type definition
// export type ProductRequest = {
//   productId: number;
//   size: string;
//   quantity: number;
// };

const SIZES  =  ["Small" , "Medium" , "Large" , "X-Large"]

export default function ProductPage() {
  const params = useParams();
  const id = params.id?.toString();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);

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
      color: selectedColor ?? "red",
      idProduct: product?.id,
      name: product?.name,
      price : product.price,
      quantity:product.quantity
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
              selectedImage === index ? "border-blue-500" : "border-transparent"
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
          className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white"
          onClick={() => setFullscreenImage(product.image_details[selectedImage])}
        >
          <Maximize2 className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogTitle />
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black">
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
 <span className="text-xl text-gray-600 font-semibold line-through">
              ${product.price}
            </span>
            }
              
            <span className="text-xl text-green-600 font-semibold">
              ${ product.discount_percentage ? (product.price - product.price * product.discount_percentage/100).toFixed(2) : product.price}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            {product.colors.map((color) => (
              <div
              onClick={()=>  setSelectedColor(color)}
                key={color}
                style={{ backgroundColor: color }}
                className={`h-5 w-5 cursor-pointer  ${selectedColor == color ? "border-blue-600 border-2 " : "border-none"}`}
              />
            ))}
          </div>

          <div className="mb-4">
            <p className="text-sm text-primary mb-3">
              Choose Size
            </p>

            <div className=" flex gap-x-2">
             { SIZES.map((ele , index)=>{
              return <h1 key = {index} onClick={()=>setSelectedSize(ele)} className={`px-2 py-2 ${selectedSize == ele ? "bg-primary text-white" : "text-primary bg-white "} border-primary border  w-20 text-center cursor-pointer`}>
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

          <Button onClick={handleAdd} className=" mt-5 bg-transparent border border-primary text-primary w-full hover:text-white">Ajouter</Button>
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
      <div className="text-center mt-12">
        <h3 className="text-xl font-bold mb-4">They Trusted Us</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "hba",
            "uniqlo",
            "ovo",
            "checkers",
            "logo4",
            "ksubi",
            "supreme",
            "acne",
            "gmbh",
          ].map((brand) => (
            <img
              key={brand}
              src={`/brands/${brand}.svg`}
              alt={brand}
              width={60}
              height={30}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
