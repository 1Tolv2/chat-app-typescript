/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Dispatch } from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import SignForm from "./SignForm";
import { UserItem } from "@chat-app-typescript/shared";
import * as api from "../../global/api";

jest.mock("../../global/api", () => {
  const mockUser: Partial<UserItem> = {
    id: "bc426c44-75d7-46fe-99f9-10793ed1adbb",
    username: "tolv",
  };

  return {
    __esModule: true,
    ...jest.requireActual("../../global/api"),
    registerUser: () => Promise.resolve(200),
    loginUser: () => Promise.resolve(mockUser),
  };
});

describe("Testing SignForm", () => {
  describe("When registering a user", () => {
    test("Should render register form", () => {
      render(
        <SignForm type={{ formType: "register", setFormType: () => {} }} />
      );

      expect(screen.getByRole("heading")).toHaveTextContent(
        "Create an account"
      );
      expect(screen.getByRole("button")).toHaveTextContent("Register");
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
    });

    test("Should have email, username and password inputs", () => {
      render(
        <SignForm type={{ formType: "register", setFormType: () => {} }} />
      );
      const inputs = screen.queryAllByDisplayValue("");
      expect(inputs).toHaveLength(3);

      expect(inputs[0]).toHaveAttribute("type", "text");
      expect(inputs[0]).toHaveAttribute("id", "email");
      expect(inputs[1]).toHaveAttribute("type", "text");
      expect(inputs[1]).toHaveAttribute("id", "username");
      expect(inputs[2]).toHaveAttribute("type", "password");
      expect(inputs[2]).toHaveAttribute("id", "password");
    });

    test("OnChange is called when input is changed", () => {
      render(
        <SignForm type={{ formType: "register", setFormType: () => {} }} />
      );

      const inputs = screen.queryAllByDisplayValue("");
      fireEvent.change(inputs[0], { target: { value: "email" } });
      expect(inputs[0]).toHaveValue("email");
      fireEvent.change(inputs[1], { target: { value: "username" } });
      expect(inputs[1]).toHaveValue("username");
      fireEvent.change(inputs[2], { target: { value: "password" } });
      expect(inputs[2]).toHaveValue("password");
    });

    test("When all values are entered form can be submitted", async () => {
      const setState = jest.fn();
      const useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation(((initialState: "login" | "register") => [
        initialState,
        setState,
      ]) as unknown as (() => [unknown, Dispatch<unknown>]) | undefined);
      render(
        <SignForm
          type={{
            formType: "register",
            setFormType: setState as (type: "login" | "register") => void,
          }}
        />
      );
      const inputs = screen.queryAllByDisplayValue("");

      fireEvent.change(inputs[0], { target: { value: "email" } });
      expect(inputs[0]).toHaveValue("email");
      fireEvent.change(inputs[1], { target: { value: "username" } });
      expect(inputs[1]).toHaveValue("username");
      fireEvent.change(inputs[2], { target: { value: "password" } });

      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();

      fireEvent.click(button);
      await waitFor(() => expect(setState).toHaveBeenCalledWith("login"));
    });

    test("When not all values are entered button is disabled", async () => {
      const setState = jest.fn();
      const useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation(((initialState: "register" | "login") => [
        initialState,
        setState,
      ]) as unknown as (() => [unknown, Dispatch<unknown>]) | undefined);
      render(
        <SignForm
          type={{
            formType: "register",
            setFormType: setState as (type: "login" | "register") => void,
          }}
        />
      );

      const inputs = screen.getAllByRole("textbox");
      fireEvent.change(inputs[0], { target: { value: "email" } });

      expect(screen.getByRole("button")).toHaveClass("disabled");
      expect(screen.getByRole("button")).toBeDisabled();
      await waitFor(() => expect(setState).not.toHaveBeenCalled());
    });
  });

  describe("When logging in a user", () => {
    test("Should render login form", () => {
      render(<SignForm type={{ formType: "login", setFormType: () => {} }} />);

      expect(screen.getByRole("heading")).toHaveTextContent("Welcome back!");
      expect(screen.getByRole("button")).toHaveTextContent("Login");
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("Should have username and password inputs", () => {
      render(<SignForm type={{ formType: "login", setFormType: () => {} }} />);
      const inputs = screen.queryAllByDisplayValue("");

      expect(inputs[0]).toHaveAttribute("type", "text");
      expect(inputs[0]).toHaveAttribute("id", "username");

      expect(inputs[1]).toHaveAttribute("type", "password");
      expect(inputs[1]).toHaveAttribute("id", "password");
    });

    test("OnSubmit login function should be called", async () => {
      const loginUserSpy = jest.spyOn(api, "loginUser").mockResolvedValue({
        id: "bc426c44-75d7-46fe-99f9-10793ed1adbb",
        username: "tolv",
      });

      render(<SignForm type={{ formType: "login", setFormType: () => {} }} />);
      const inputs = screen.queryAllByDisplayValue("");
      fireEvent.change(inputs[0], { target: { value: "email" } });
      fireEvent.change(inputs[1], { target: { value: "password" } });
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();

      fireEvent.click(button);
      expect(loginUserSpy).toHaveBeenCalled();
      expect(loginUserSpy).toHaveBeenCalledWith("email", "password");
    });
  });
});
