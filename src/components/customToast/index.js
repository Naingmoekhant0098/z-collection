// import { toast } from "sonner";

// export default {
//   success: (title, description) => {
//     toast.success(title, {
//       description: description,
//       position: "top-center",
//       icon: "🚀",
//       style: {
//         borderRadius: "12px",
//         padding: "12px 16px",
//         fontSize: "14px",
//       },
//     });
//   },
//   error: (title, description) => {
//     toast.error(title, {
//       description: description,
//       position: "top-center",
//       icon: "⛔️",
//       style: {
//         color: "black",
//         borderRadius: "12px",
//         padding: "12px 16px",
//         fontSize: "14px",
//       },
//     });
//   },
// };

import { toast } from "sonner";

const baseStyle = {
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
};

const buildOptions = (description, extra = {}) => ({
  ...(description && { description }), // only add if exists
  position: "top-center",
  style: baseStyle,
  ...extra,
});

export default {
  success: (title, description) => {
    toast.success(
      title,
      buildOptions(description, {
        icon: "🚀",
      })
    );
  },

  error: (title, description) => {
    toast.error(
      title,
      buildOptions(description, {
        icon: "⛔️",
        style: { ...baseStyle, color: "black" },
      })
    );
  },
};