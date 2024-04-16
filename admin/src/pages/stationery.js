import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProductGrid = () => {
  const nameref = useRef(null);
  const typeref = useRef(null);
  const subtyperef = useRef(null);
  const imgref = useRef(null);
  const priceref = useRef(null);
  const availref = useRef(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://bookmart-website.onrender.com/api/product/');
      const productsWithImageUrl = await Promise.all(response.data.map(async product => {
        const imgResponse = await axios.get(`https://bookmart-website.onrender.com/api/product/${product.name}/image`, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(imgResponse.data);
        return { ...product, img: imageUrl };
      }));
      setProducts(productsWithImageUrl);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const addProduct = async () => {
    try {
      const name = nameref.current.value.trim();
      const type = typeref.current.value.trim();
      const subtype = subtyperef.current.value.trim();
      const price = priceref.current.value.trim();
      const availability = availref.current.value.trim();

      if (!name || !price || !availability) {
        console.error('Name, price, and availability are required.');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('img', imgref.current.files[0]);
      formData.append('availability', availability);
      formData.append('price', price);
      formData.append('type', type);
      formData.append('subtype', subtype);

      await axios.post('https://bookmart-website.onrender.com/api/product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const resetForm = () => {
    nameref.current.value = '';
    typeref.current.value = '';
    subtyperef.current.value = '';
    imgref.current.value = null;
    availref.current.value = '';
    priceref.current.value = '';
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const saveEdit = async () => {
    try {
      const updatedProduct = {
        _id: editingProduct._id,
        name: nameref.current.value.trim(),
        type: typeref.current.value.trim(),
        subtype: subtyperef.current.value.trim(),
        price: priceref.current.value.trim(),
        availability: availref.current.value.trim(),
        img: editingProduct.img 
      };

      const response = await axios.put(`https://bookmart-website.onrender.com/api/product/${updatedProduct._id}`, updatedProduct);
      if(response.status === 200){
        console.log('succesfully updated');
      }
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const productCardStyle = {
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div>
      <h1>Product Grid</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            {editingProduct && editingProduct._id === product._id ? (
              <div>
                <img src={product.img} alt={product.name} style={productCardStyle} />
                <input type="text" defaultValue={product.name} ref={nameref} />
                <input type="text" defaultValue={product.type} ref={typeref} />
                <input type="text" defaultValue={product.subtype} ref={subtyperef} />
                <input type="text" defaultValue={product.availability} ref={availref} />
                <input type="text" defaultValue={product.price} ref={priceref} />
                <button className='btn-1' style={{marginRight:'0.2rem'}} onClick={saveEdit}>Save</button>
                <button className='btn-1' style={{marginLeft:'0.2rem'}} onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <img src={product.img} alt={product.name} style={productCardStyle} />
                <p>Name: {product.name}</p>
                <p>Type: {product.type}</p>
                <p>Type: {product.subtype}</p>
                <p>Avail: {product.availability.toString()}</p>
                <p>Price: {product.price}</p>
                <button className='btn-1' onClick={() => handleEdit(product)}>Edit</button>
              </div>
            )}
          </div>
        ))}
        <div className="product-grid">
        <h2>Add Product</h2>

        <label htmlFor="img">Image:</label> <input type="file" name="img" accept="image/*" ref={imgref} />
        <input type="text" placeholder="Name" ref={nameref} />
        <input type="text" placeholder="Type" ref={typeref} />
        <input type="text" placeholder="SubType" ref={subtyperef} />
        <input type="text" placeholder="Availability" ref={availref} />
        <input type="text" placeholder="Price" ref={priceref} />
        <button className='btn-1' onClick={addProduct}>Add Product</button>
      </div>
      </div>
    </div>
  );
};

export default ProductGrid;
