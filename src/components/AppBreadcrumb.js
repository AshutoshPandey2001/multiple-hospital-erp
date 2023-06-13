// /* eslint-disable prettier/prettier */
// import React from 'react'
// import { useLocation } from 'react-router-dom'
// import { NavLink } from 'react-router-dom'

// import routes from '../routes'
// import { useSelector, useDispatch } from 'react-redux'

// import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
// import { selectUsertype } from 'src/redux/slice/authSlice'
// import receptionRoutes from 'src/receptionRoutes'
// import medroutes from 'src/medRoutes'
// import laboratoryRoutes from 'src/laboratoryRoutes'

// const AppBreadcrumb = () => {
//   const currentLocation = useLocation().pathname
//   const userType = useSelector(selectUsertype)
//   const location = useLocation();

//   const getRouteName = (pathname, routes) => {
//     const currentRoute = routes.find((route) => route.path === pathname)
//     return currentRoute ? currentRoute.name : false
//   }

//   const getBreadcrumbs = (location) => {
//     const breadcrumbs = []
//     location.split('/').reduce((prev, curr, index, array) => {
//       const currentPathname = `${prev}/${curr}`
//       let routeName = undefined;
//       (() => {
//         switch (userType) {

//           case 'Admin':
//             return (
//               routeName = getRouteName(currentPathname, routes)
//             )
//           case 'Medical':
//             return (
//               routeName = getRouteName(currentPathname, medroutes)
//             )
//           case 'Reception':
//             return (
//               routeName = getRouteName(currentPathname, receptionRoutes)
//             )
//           case 'Laboratory':
//             return (
//               routeName = getRouteName(currentPathname, laboratoryRoutes)
//             )

//           default:
//             return (
//               routeName = getRouteName(currentPathname, routes)
//             )
//         }
//       })()
//       routeName &&
//         breadcrumbs.push({
//           pathname: currentPathname,
//           name: routeName,
//           active: index + 1 === array.length ? true : false,
//         })
//       return currentPathname
//     })
//     return breadcrumbs
//   }

//   const breadcrumbs = getBreadcrumbs(currentLocation)

//   return (
//     <CBreadcrumb className="m-0 ms-2">
//       {/* <CBreadcrumbItem href="/">Home</CBreadcrumbItem> */}
//       {breadcrumbs.map((breadcrumb, index) => {
//         return (
//           <CBreadcrumbItem
//             key={index}
//           >
//             <NavLink to={breadcrumb.pathname} style={({ isActive }) => { return { color: isActive ? 'blue' : '#5C607B' } }} isActive={(match, location) => {
//               // Custom logic to determine if the NavLink is active
//               // You can use location.pathname or any other condition
//               return location.pathname === currentLocation;
//             }}
//             >{breadcrumb.name}</NavLink>
//           </CBreadcrumbItem>
//         )
//       })}
//     </CBreadcrumb>
//   )
// }

// export default React.memo(AppBreadcrumb)
/* eslint-disable prettier/prettier */
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { useSelector } from 'react-redux';
import routes from '../routes';
import receptionRoutes from 'src/receptionRoutes';
import medroutes from 'src/medRoutes';
import laboratoryRoutes from 'src/laboratoryRoutes';
import { selectUsertype } from 'src/redux/slice/authSlice';

const AppBreadcrumb = () => {
  const navigate = useNavigate()

  const currentLocation = useLocation().pathname;
  const userType = useSelector(selectUsertype);

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };
  const goBack = () => {
    navigate(-1)
  }
  // const getRouteName = (pathname, routes) => {
  //   const currentRoute = routes.find((route) => {
  //     if (route.path.includes(':')) {
  //       return false;
  //     }
  //     return route.path === pathname;
  //   });
  //   return currentRoute ? currentRoute.name : false;
  // };
  // const getRouteName = (pathname, routes) => {
  //   const currentRoute = routes.find((route) => {
  //     const routePath = route.path;
  //     const isParameterized = routePath.includes(':');
  //     if (isParameterized) {
  //       const pathSegments = pathname.split('/');
  //       const routeSegments = routePath.split('/');
  //       console.log('pathSegments', pathSegments, pathname);
  //       if (pathSegments.length !== routeSegments.length) {
  //         return false;
  //       }
  //       for (let i = 0; i < pathSegments.length; i++) {
  //         if (!routeSegments[i].startsWith(':') && pathSegments[i] !== routeSegments[i]) {
  //           return false;
  //         }
  //       }
  //       return true;
  //     }
  //     return routePath === pathname;
  //   });
  //   return currentRoute ? currentRoute.name : false;
  // };
  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      let routeName = undefined;
      switch (userType) {
        case 'Admin':
          routeName = getRouteName(currentPathname, routes);
          break;
        case 'Medical':
          routeName = getRouteName(currentPathname, medroutes);
          break;
        case 'Reception':
          routeName = getRouteName(currentPathname, receptionRoutes);
          break;
        case 'Laboratory':
          routeName = getRouteName(currentPathname, laboratoryRoutes);
          break;
        default:
          routeName = getRouteName(currentPathname, routes);
      }
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="m-0 ms-2">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem key={index}>
            <NavLink
              to={breadcrumb.pathname}
              style={({ isActive }) => {
                return { color: isActive ? 'blue' : '#5C607B' };
              }}
            >
              {breadcrumb.name}
            </NavLink>
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);



