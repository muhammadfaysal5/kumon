export default class ApiResponse {
  static result = (res, data, status, token) => {
    res.status(status);
    res.json({
      data: data,
      success: true,
      token: token,
    });
  };
}
