import { useEffect, useRef, useState } from "react";
import axios from "axios";

const url = "https://lumus.wistis.ru"



function App() {
  const [buttonText, setButtonText] = useState("Продолжить")
  const [loginHeaderText, setLoginHeaderText] = useState("Вход или регистрация")
  const [isLogin, setIsLogin] = useState(false)
  const [isRegistration, setisRegistration] = useState(false)
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState();
  const [isValid, setValid] = useState(false);
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const nameRef = useRef("")
  const telRef = useRef("")


  const validate = () => {
    let isValid = true;
    let errors = {};
    if (emailRef.current.value === "") {
      isValid = false;
      errors["email"] = "Please enter your email.";
    }
    if (emailRef.current.value !== "") {
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(emailRef.current.value)) {
        isValid = false;
        errors["email"] = "Please enter valid email address.";
      }
    }
    if (passwordRef.current?.value === "") {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }
    if (nameRef.current?.value === "") {
      isValid = false;
      errors["name"] = "Please enter your name.";
    }
    if (telRef.current?.value === "") {
      isValid = false;
      errors["tel"] = "Please enter your tel.";
    }
    setErrors(errors)
    setValid(isValid)
  }
  useEffect(() => {
    if (isValid && buttonText === "Продолжить") {
      axios.post(url + '/api/v1/auth/check-email', {
        email: emailRef.current.value
      }).then((res) => {
        if (res.data.exists > 0) {
          setIsLogin(true)
          setButtonText("Войти")
          setLoginHeaderText("Вход")
        }
        else {
          setisRegistration(true)
          setButtonText("Создать аккаунт")
          setLoginHeaderText("Регистрация")
        }

      })
    }
  }, [isValid])

  const formSumbit = (e) => {

    e.preventDefault();
    validate()
    if (isValid && isLogin) {
      axios.post(url + '/api/v1/auth/login', {
        email: emailRef.current.value,
        password: passwordRef.current.value
      }).then((res) => {
        setUser(res.data.user)
        alert(res.data.user.name + " залогинен")
      }).catch(er => {
        if (er.response.status === 401) {
          alert("неправильно введенные данные")
        }
      })
    }
    if (isValid && isRegistration) {
      axios.post(url + '/api/v1/auth/register', {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        phone: telRef.current.value
      }).then((res) => {
        alert("Вы зарегестрированы")
        setisRegistration(false)
        setIsLogin(true)
        setButtonText("Войти")

      }).catch(er => {
        if (er.response.status === 422) {
          alert("неправильно введенные данные")
        }
      })
    }

  }
  const backState = (e) => {
    e.preventDefault();
    setIsLogin(false)
    setisRegistration(false)
    setButtonText("Продолжить")
    setLoginHeaderText("Вход или регистрация")
    setValid(false)
    emailRef.current.value = ""
  }

  return (
    <div className="App">

      <form className="form">
        <div className="form__header">
          {
            isLogin || isRegistration
              ?
              <button className="form__back" onClick={backState}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg>
              </button>
              : null
          }
          {loginHeaderText}
        </div>
        <hr />
        <div className="form-group">
          <label className="label-input" htmlFor="email">
            E-mail
          </label>
          <input id="email" className="form-control" ref={emailRef} placeholder="e-mail" type="email" />
          <div className="text-danger">{errors?.email}</div>
        </div>
        {
          isLogin || isRegistration
            ? <div className="form-group">
                <label className="label-input" htmlFor="password" > Пароль</label>
                <input className="form-control" ref={passwordRef} id="password" placeholder="password" type="password" />
              </div>
            : null
        }
        {
          isRegistration
            ? <div>
                <div className="form-group">
                  <label className="label-input" htmlFor="name" >Имя Фамилия</label>
                  <input className="form-control" ref={nameRef} placeholder="name" type="text" id="name" />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor="tel">Телефон</label>
                  <input className="form-control" ref={telRef} id="tel" placeholder="telephone" type="tel" />
                </div>
              </div>
            : null
        }
        <button className="btn btn-primary" onClick={formSumbit}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default App;
