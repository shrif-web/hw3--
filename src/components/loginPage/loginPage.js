import { Form, Button, Card, Input, Row, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { addNote, login } from "../../redux/actions";
import { loginProccess, signUpProccess } from "../../controller/loginController";

const mapStateToProps = (state) => {
  return { isLoggedIn: state.isLoggedIn };
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: (userData) => dispatch(login(userData)),
    setNote: (data) => dispatch(addNote(data)),
  };
};

const LoginPage = ({ isLoggedIn, login, setNote }) => {
  const navigate = useNavigate();

  if (isLoggedIn) navigate("/notes");

  return (
    <div className="App">
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Card>
          <Demo navigate={navigate} login={login} setNote={setNote} />
        </Card>
      </Row>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
const Demo = ({ navigate, login, setNote }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("fields:", values);
    let result;
    if (isSignUp) {
      console.log("signUp");
      result = await signUpProccess(
        values["username"],
        values["password"],
        values["r_password"]
      );
    } else {
      console.log("login");
      result = await loginProccess(values["username"], values["password"]);
    }

    console.log("fields:", result);
    if (result.status) {
      login(result.data);
      // setNote([])
      navigate("/notes");
    } else {
      message.error(result.message);
    }
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {isSignUp ? (
        <Form.Item
          label="Reapeat"
          name="r_password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
      ) : null}

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          // onClick={() => navigate("/notes")}
        >
          Submit
        </Button>
      </Form.Item>
      <Button onClick={() => setIsSignUp(!isSignUp)}>
        {!isSignUp ? "go to sign in" : "go to log in"}
      </Button>
    </Form>
  );
};
