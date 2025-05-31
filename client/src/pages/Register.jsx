import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Register = () => {
  const suburbRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', suburb: '', mobile: '', preferences: '', age_category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.onload = () => {
      if (window.AddressFinder) {
        const widget = new window.AddressFinder.Widget(suburbRef.current, 'LY9F6XD7MUTJ43GNRHEQ', 'AU');
        widget.on('result:select', (full, meta) => {
          setFormData(prev => ({ ...prev, suburb: meta.locality_name }));
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async e => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5050/api/auth/register', formData);
    setSuccess(true);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      suburb: '',
      mobile: '',
      preferences: '',
      age_category: ''
    });

    // Clear AddressFinder input manually if used
    if (suburbRef?.current) {
      suburbRef.current.value = '';
    }

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  } catch (err) {
    setError('Registration failed');
    setSuccess(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefaf6] text-[#0a2342] px-4">
       <img src={logo} alt="Coffee Companion Logo" className="w-32 h-32 mb-6" />
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-3 rounded border border-gray-300" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="w-full p-3 rounded border border-gray-300" required />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-3 rounded border border-gray-300" required />
        <input name='suburb' ref={suburbRef} placeholder="Suburb" className="w-full p-3 rounded border border-gray-300" required />
        <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded" required/>
        <input type="text" name="preferences" placeholder="Your interests (e.g., cycling, cat person)" value={formData.preferences} onChange={handleChange} className="w-full p-2 border rounded"/>
        <select name="age_category" value={formData.age_category} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select age range</option>
          <option value="18-22">18–22</option>
          <option value="23-27">23–27</option>
          <option value="28-32">28–32</option>
          <option value="33-37">33–37</option>
          <option value="38-42">38–42</option>
          <option value="43-47">43–47</option>
          <option value="48-52">48–52</option>
          <option value="53-57">53–57</option>
          <option value="58-62">58–62</option>
          <option value="63-67">63–67</option>
          <option value="68-72">68–72</option>
          <option value="73-77">73–77</option>
          <option value="78-82">78–82</option>
          <option value="83-87">83–87</option>
          <option value="88-92">88–92</option>
          <option value="90+">90+</option>
        </select>
        <button type="submit" className="w-full bg-[#f97316] text-white py-3 rounded-md font-semibold">Register</button>
      </form>
      <div className="mt-4 text-center"><p className="text-sm text-gray-600">Already have an account?
        <a href="/login" className="ml-2 text-blue-600 hover:underline">Log in</a></p>
        </div>


      {success && <p className="text-green-600 mt-4">✅ Registered! Redirecting...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Register;