// Function to check if the user is logged in
export const userLogged = () => {
  const user = JSON.parse(localStorage.getItem("userLogged"));
  return user ? user : null;
};
