import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "../Common/InputField";
import Button from "../Common/Button";

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        type="email"
        label="メールアドレス"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        type="password"
        label="パスワード"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit">ログイン</Button>
    </form>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default LoginForm;
