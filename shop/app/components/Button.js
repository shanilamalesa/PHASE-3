//reusable react button component

export default function Button({ variant = "primary", className = "", children, ...props }) {
  //children -> is going to be bwt the open and closing tag
  const base = "inline-flex items-center justify-center px-6 py-3 rounded font-medium transition";//apply to all the buttons
  //variant object
  const variants = { 
    primary: "bg-brand text-white hover:opacity-90 disabled:opacity-50",
    secondary: "bg-white text-brand border border-brand hover:bg-gray-50",
    ghost: "text-brand hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

{/* <button  type="submit" disabled onClick="{save}">   SAVE</button>
variant = "primary"
children = "SAVE"
className = "saveButton1"
props = {
  type="submit",
  disabled = true,
  onClick - save
} */}
