const typeOf = (value) => {
  const type = Object.prototype.toString.call(value).slice(8, -1);
  return type;
};
export default typeOf;
