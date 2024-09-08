import { loginFailure, loginStart, loginSuccess } from "../redux/userRedux";
import { publicRequest, userRequest } from "../requestMethod";

  export const signup = async(dispatch, payload)=>{
    dispatch(loginStart());

    try {
      let res = await publicRequest.post("user/sign-up", payload);
      dispatch(loginSuccess(res.data));
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("signup error", error);
      dispatch(loginFailure());
      return error;

    }
  }
export const signIn = async (user, credentials) => {
  try {
    let res = await publicRequest.post("user/sign-in", credentials);
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};

export const AddtoFavAPI = async (movieID) => {
  try {
    const token = localStorage.getItem("token");

    let res = await userRequest(token).post("user/add-fav", movieID);
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};

export const isFavAPI = async (isfavId) => {
  try {
    const token = localStorage.getItem("token");

    let res = await userRequest(token).get(`user/is-fav/${isfavId}`);
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};

export const getAllFavAPI = async () => {
  try {
    const token = localStorage.getItem("token");

    let res = await userRequest(token).get("movie/getAllFavs");
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};
export const addMOvieLinkAPI = async (movieId, link) => {
  try {
    const token = localStorage.getItem("token");

    let res = await userRequest(token).post("movie/add-link", {
      movieId,
      link,
    });
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};

export const getMovieLinkAPI = async (movieId) => {
  try {
    const token = localStorage.getItem("token");

    let res = await publicRequest.get(`movie/get-link/${movieId}`);
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};

export const getPopularMovies = async ( pageNumber) => {
  try {
    const token = localStorage.getItem("token");

    let res = await publicRequest.get(`movie/getAllMovies/${pageNumber}`);
    return res.data;
  } catch (error) {
    console.log("There is an error while login", error);
    return error;
  }
};
