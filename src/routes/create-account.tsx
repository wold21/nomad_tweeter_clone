import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Form,
    Input,
    Switcher,
    Title,
    Wrapper,
    Error,
} from "../components/auth-components";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            setIsloading(true);
            const credintials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(credintials.user, {
                displayName: name,
            });
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setIsloading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Join 🤫</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="name"
                    value={name}
                    placeholder="Name"
                    type="text"
                    required
                />
                <Input
                    onChange={onChange}
                    name="email"
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    onChange={onChange}
                    name="password"
                    value={password}
                    placeholder="Password"
                    type="password"
                    required
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Create Account"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already an account? <Link to="/login">Login &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}
