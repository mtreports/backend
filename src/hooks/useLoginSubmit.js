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


  const ondefaultLogin = ({name, email, password, role, bulkop }) => {
=======
  const onSubmit = ({ name="test.com", email="test@gmail.com", verifyEmail="test@gmail.com", password="hduhdsu", role="Admin" }) => {
>>>>>>> 1e3b846c2047efb31ccdbe8caf78224cf492402e
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
      AdminServices.registerAdmin({ name, email, password, role, bulkop })
=======
      AdminServices.getshopdetail().then((res)=>{
        console.log(res)
      })
      AdminServices.registerAdmin({ name, email, password, role })
>>>>>>> 1e3b846c2047efb31ccdbe8caf78224cf492402e
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
