import React, { useState } from "react";
import useForm from "useForm";

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { register } = useForm({ defaultValues: { name: "", email: "" } });
  return (
    <>
      일반 폼
      <form>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button>제출</button>
      </form>
      useForm 사용
      <form>
        <div>
          <input {...register("name")} />
        </div>
        <input {...register("email")} />
        <button>제출</button>
      </form>
    </>
  );
};

export default App;
