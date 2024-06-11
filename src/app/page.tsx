export default async function Home() {
console.log("here in home")
const data = await fetch("http://localhost:3000/api/update", {method: "POST"});
  
  return (
    <div>hello</div>
  );
}
