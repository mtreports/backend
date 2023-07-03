import React from 'react';
import AdminServices from 'services/AdminServices';

const SyncData = () => {
   
    const getdatttaa = async () => {
        const shop_detail =  await AdminServices.getproductcount();
        console.log(shop_detail.countData);
         }
        getdatttaa();
  return(
    <>
    <span>
    data
    </span>
    </>
  )
};

export default SyncData;
