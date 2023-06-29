import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { AdminContext } from 'context/AdminContext';
import AdminServices from 'services/AdminServices';
import { notifyError, notifySuccess } from 'utils/toast';

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ name, email, verifyEmail, password, role }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    if (location.pathname === '/login') {
      AdminServices.loginAdmin({ email, password })
        .then((res) => {
          if (res) {
            setLoading(false);
            // notifySuccess('Login Success!');
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', JSON.stringify(res), {
              expires: cookieTimeOut,
            });
            history.replace('/');
          }
        })
        .catch((err) => {
          notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

    if (location.pathname === '/signup') {
      AdminServices.registerAdmin({ name, email, password, role })
        .then((res) => {
          if (res) {
            setLoading(false);
            // notifySuccess('Register Success!');
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', JSON.stringify(res), {
              expires: cookieTimeOut,
            });
            history.replace('/');
          }
        })
        .catch((err) => {
          notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

    if (location.pathname === '/forgot-password') {
      AdminServices.forgetPassword({ verifyEmail })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err ? err.response.data.message : err.message);
        });
    }
  };

  const ondefaultLogin = ({name, email, password, role }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    if (location.pathname === '/login') {
      AdminServices.loginAdmin({email, password})
        .then((res) => {
          if (res) {
            setLoading(false);
           
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDlkMjcyZjUxMDhmNzJjOTRhZTFhNTEiLCJuYW1lIjoiSW5kaWFuLUFwcmljb3QiLCJlbWFpbCI6InNodWJoYW1yYXRoNTkwQGdtYWlsLmNvbSIsImlhdCI6MTY4ODAzOTE1NCwiZXhwIjoxNjg4MjExOTU0fQ.VJWKG7tnK-Y9J22qqIPkTnVxeH5Bdcd8-Vu2a-ejrUk","_id":"649d272f5108f72c94ae1a51","name":"Indian-Apricot","email":"shubhamrath590@gmail.com"}', {
              expires: cookieTimeOut,
            });
            history.replace('/dashboard');
          }
        })
        .catch((err) => {
          notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

    if (location.pathname === '/signup') {
      AdminServices.registerAdmin({ name, email, password, role })
        .then((res) => {
          if (res) {
            setLoading(false);
            // notifySuccess('Register Success!');
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDlkMjcyZjUxMDhmNzJjOTRhZTFhNTEiLCJuYW1lIjoiSW5kaWFuLUFwcmljb3QiLCJlbWFpbCI6InNodWJoYW1yYXRoNTkwQGdtYWlsLmNvbSIsImlhdCI6MTY4ODAzOTE1NCwiZXhwIjoxNjg4MjExOTU0fQ.VJWKG7tnK-Y9J22qqIPkTnVxeH5Bdcd8-Vu2a-ejrUk","_id":"649d272f5108f72c94ae1a51","name":"Indian-Apricot","email":"shubhamrath590@gmail.com"}', {
              expires: cookieTimeOut,
            });
            history.replace('/dashboard');
          }
        })
        .catch((err) => {
          notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

  };

  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
    ondefaultLogin,
  };
};

export default useLoginSubmit;
