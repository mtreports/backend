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

<<<<<<< HEAD
  const onSubmit = ({ name, email, verifyEmail, password, role }) => {
=======


  const ondefaultLogin = ({name, email, password, role, bulkop }) => {
>>>>>>> 59b321d819ea485e3fe9fc0e1c176e712e92cef3
    setLoading(true);
    const cookieTimeOut = 0.5;

    if (location.pathname === '/login') {
      AdminServices.loginAdmin({email, password})
        .then((res) => {
          if (res) {
            setLoading(false);
           
            dispatch({ type: 'USER_LOGIN', payload: res });
            Cookies.set('adminInfo', JSON.stringify(res), {
              expires: cookieTimeOut,
            });
            history.replace('/dashboard');
          }
        })
        .catch((err) => {
          // notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

    if (location.pathname === '/signup') {
<<<<<<< HEAD
      AdminServices.registerAdmin().then(()=>{
        console.log(res);
      })
      AdminServices.registerAdmin({ name, email, password, role })
=======
      AdminServices.registerAdmin({ name, email, password, role, bulkop })
>>>>>>> 59b321d819ea485e3fe9fc0e1c176e712e92cef3
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
          // notifyError(err ? err.response.data.message : err.message);
          setLoading(false);
        });
    }

  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    ondefaultLogin,
  };
};

export default useLoginSubmit;
