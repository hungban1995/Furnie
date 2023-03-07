import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { connect } from "react-redux";
import {
  getModal,
  getProductCategoryUpdate,
  setCount,
  setNotify,
} from "../../store/Action";
import { useCallback, useEffect, useState } from "react";
import { getData, postData } from "../../libs/fetchData";
import Table from "react-bootstrap/esm/Table";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { IMG_URL } from "../../constants";
import { BlankImg } from "../../images";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EditProductCategory from "./edit-category";
import MessageModal from "../../components/alert/messageModal";
import Notify from "../../components/alert/notify";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required();
const CategoriesProducts = (props) => {
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const getCategory = useCallback(async () => {
    try {
      const response = await getData("product-category");
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCategory();
  }, [getCategory, props.count]);

  // Edit string
  function toSlug(str) {
    str = str.toLowerCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    str = str.replace(/[đĐ]/g, "d");

    str = str.replace(/([^0-9a-z-\s])/g, "");

    str = str.replace(/(\s+)/g, "-");

    str = str.replace(/-+/g, "-");

    str = str.replace(/^-+|-+$/g, "");

    // return
    return str;
  }
  // create categories
  const onSubmit = async (data) => {
    let nameCategory = data.title;
    let url;
    if (!data.url) {
      url = toSlug(nameCategory);
    }

    const newData = { ...data, content, url };
    const formData = new FormData();

    try {
      const fileList = [...newData.image];
      fileList.forEach((item) => {
        formData.append("image", item);
      });
      formData.append("title", newData.title);
      formData.append("url", newData.url);
      formData.append("description", newData.description);
      formData.append("content", newData.content);
      const res = await postData("product-category/create", formData);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      reset();
      props.setCount();
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };

  //edit------
  const handClickEdit = (category) => {
    props.setUpdateProductCategory({
      category: category.category,
      update: true,
    });
  };
  //- delete---
  const handClickDelete = (category) => {
    props.setModalReducer({
      show: true,
      deleteCategory: true,
      message: "Do you want to delete this Category",
      id: category._id,
    });
  };
  return (
    <div className="m-3">
      <div className="text-center">
        <h5>Manager Categories Page</h5>
        <p>This page CRUD Categories</p>
      </div>
      <div className="m-2">
        <form onSubmit={handleSubmit(onSubmit)} className=" p-2 rounded">
          <Row>
            <Col>
              <label className="form-label">Category Name</label>
              <input
                className="form-control"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="error-message">{errors.title.message}</p>
              )}
            </Col>
            <Col>
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                {...register("image")}
              />
            </Col>
          </Row>

          <label className="form-label">Description</label>
          <input className="form-control" {...register("description")} />

          <label className="form-label">Seo Url</label>
          <input className="form-control" {...register("url")} />
          <label className="form-label">Content</label>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
          <input className="form-control btn btn-primary mt-3" type="submit" />
        </form>
      </div>
      <div className="mt-3">
        <div
          className="table-responsive"
          style={{ height: "300px", overflow: "auto" }}
        >
          <Table
            className="table-fixed-header"
            striped
            bordered
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>image</th>
                <th>Description</th>
                <th>SeoUrl</th>
                <th style={{ alignItems: "center", textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categories ? (
                categories.map((category, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{category.category.title}</td>
                      <td>
                        <img
                          alt="category-img"
                          src={
                            category.category.image && category.category.image
                              ? `${IMG_URL}/${category.category.image}`
                              : BlankImg
                          }
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "5px",
                          }}
                        />
                      </td>
                      <td>{category.category.description}</td>
                      <td>{category.category.url}</td>
                      <td style={{ alignItems: "center", textAlign: "center" }}>
                        <AiOutlineEdit
                          fontSize={30}
                          color="blue"
                          className="me-2"
                          onClick={() => {
                            handClickEdit(category);
                          }}
                        />
                        <AiOutlineDelete
                          fontSize={30}
                          className="me-2"
                          onClick={() => {
                            handClickDelete(category.category);
                          }}
                          color="red"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>Empty data...!</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <MessageModal />
      <Notify />
      <EditProductCategory />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    count: state.CounterReducer,
    modal: state.ModalReducer.modal,
    notify: state.NotifyReducer,
    updateCategory: state.ProductCategoryReducer.updateCategory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },
    setUpdateProductCategory: (category) => {
      dispatch(getProductCategoryUpdate(category));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesProducts);
