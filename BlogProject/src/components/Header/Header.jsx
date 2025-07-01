import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import service from '../../appwrite/serviceConfig';
import { Container, Logo, LogoutBtn } from '../index';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData?.userData.name);

 
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  
  ]

  return (
    <header className='py-2 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px'   />
              </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                >
                  {item.name}
                </button>
              </li>
            ) : null
            )}

            {/* Hr alternates */}
            {authStatus && (
                <li className="w-px h-auto bg-white opacity-40 mx-2" aria-hidden="true"></li>
              )}
              
              {/* Authenticated User Profile */}
            {authStatus && (
              <>
                <li className='mr-4 flex items-center'>
                  <Link to='/profile' className="flex items-center space-x-2 hover:bg-blue-100 px-2 py-2 rounded-full duration-200">
                    <img src={
                              userData?.profileImage ? service.getFilePreview(userData.profileImage)
                                : `https://ui-avatars.com/api/?name=${userData || 'User'}&background=random`   // : "/images/avatar.png" // or use a URL like 
                              }
                              onError={(e) => {
                              e.target.src = "https://www.flaticon.com/free-icons/astronaut"; // fallback on error
                          }}
                          
                          alt="https://www.flaticon.com/free-icons/astronaut"
                          className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className='hidden md:inline-block text-black font-semibold'>
                        {userData || "Profile"}
                      </span>
                  </Link>
                
                <span className="ml-2">
                  <LogoutBtn  />
                </span>
                  
                </li>
            </>
            )}
          </ul>
        </nav>
        </Container>
    </header>
  )
}

export default Header