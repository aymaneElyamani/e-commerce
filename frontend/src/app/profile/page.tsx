"use client"
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user } = useAuthStore();
  const { push } = useRouter();

  const handleEdit = () => {
    push("/profile/edit"); // Redirect to the edit profile page
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <motion.h1
        className="text-muted-foreground text-lg mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
      <span className="text-foreground font-semibold">Home / Profile</span>
      </motion.h1>

      <motion.section
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Profile Image */}
                <div className="w-full h-full relative aspect-square rounded-full overflow-hidden">
                  <Image
                    src={user?.cover_img ?? "/img/profile.png"}
                    alt={`${user?.name} ${user?.name} john`}
                    fill
                    className="object-cover"
                  />
                </div>

              {/* Profile Information */}
              <div className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-center md:text-left">
                    <span className="font-bold text-xl">{`${user?.name ?? "uknowon"}`}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div><span className="font-semibold">Email:</span> {user?.email}</div>
                  <div><span className="font-semibold">Phone:</span> +212 600 0001 00</div>
                </CardContent>
              </div>
            </div>
          </Card>
        </motion.div>

        <Separator />

        <motion.div
          className="text-center md:text-right"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            className="w-full md:w-auto px-6 py-2 text-primary-foreground bg-primary hover:bg-primary/90"
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default Profile;
