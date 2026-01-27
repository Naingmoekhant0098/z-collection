import { toast } from "sonner"

export default{
    success : (title , description )=>{
        toast.success(title, {
            description: description,
            position : "top-center",
             icon: "🚀",
             style: {
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
             
          })
    },
    error : (title , description )=>{
        toast.error(title, {
            description: description,
            position : "top-center",
            icon: "⛔️",
            style: {
               borderRadius: "12px",
               padding: "12px 16px",
               fontSize: "14px",
             },
             
             
          })
    }
}