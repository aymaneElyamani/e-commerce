
interface User {
   id : number;
   email : string;
   name : string | undefined;
   cover_img : string | undefined;
 
 }

 interface Product  {
  id : string;
  name : string;
  description :  string;
  price : number; 
  created_at :string;
  quantity : int;
  image_cover : string  | null;
  image_details : string[];
  discount_percentage : number;
  category : string,
  colors : string[]
}

interface AddToCardType {
  idCart: number | null;
  idProduct: string;
  name: string;
  price: number;
  quantity: number;
  image_cover: string | null;
  color: string;
  size: string;
}

interface Offer {
  id : string;
  discount_percentage : number;
  product_image_cover : string | null;
  product_name : string;
  product_price : number;
  title : string;
  product_id : number;
}



 interface OrderItem {
  product_id: string;
  quantity: number;
  color : string;
  size: string;
}

 interface LineItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

 interface Order {
  id: string;
  status : string | undefined | null;
  utilisateur_id: string;
  total_price: number;
  created_at: string;
  items?: LineItem[];
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string | null;
}
