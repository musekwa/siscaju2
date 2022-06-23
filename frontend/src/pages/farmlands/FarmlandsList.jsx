import React, {  Fragment} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import {
  Box,
  Fab,
  Stack,
  Tooltip,
} from "@mui/material";
import Footer from "../../components/Footer";
import { useNavigate,  Link } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Spinner from "../../components/Spinner";
import SearchModal from "../../components/SearchModal";
import { useGetFarmlandsByQuery } from "../../features/api/apiSlice";

const FarmlandsList = ({ user }) => {

  const navigate = useNavigate();

  let filterBy =
    user?.role === "Extensionista"
      ? user?.address?.district
      : user?.role === "Gestor"
      ? user?.address?.province
      : user?.role === "Produtor"
      ? user?.address?.territory
      : null;
  const {
    data: farmlands,
    isError,
    isSuccess,
    error,
    isLoading,
  } = useGetFarmlandsByQuery(filterBy, {
    fixedCacheKey: "farmlands",
  });

  if (isLoading) {
    return <Spinner />;
  }

  const onAddFarmland = () => {
    navigate("/farmland-add");
  };

  const getTreesAverageAge = (divisions) => {
    let sum = 0;
    divisions.forEach((div) => {
      sum += div.sowingYear;
    });
    return new Date().getFullYear() - Math.ceil(sum / divisions?.length);
  };

  const normalizeDate = (date) => {
    return (
      new Date(date).getDate() +
      "/" +
      (new Date(date).getMonth() + 1) +
      "/" +
      new Date(date).getFullYear()
    );
  };

  return (
    <Box>
      <Navbar
        pageDescription={user?.address?.district}
        isManageSearch={true}
        isSearchIcon={true}
        user={user}
      />
      <Tooltip
        onClick={onAddFarmland}
        title="Adicine produtor"
        sx={{ position: "fixed", bottom: 60, right: 25 }}
      >
        <Fab aria-label="add" color="rebecca">
          <Add fontSize="large" color="white" />
        </Fab>
      </Tooltip>
      {farmlands && farmlands.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center ",
            width: "100%",
            height: "90vh",
          }}
        >
          <Box sx={{ width: "600px" }}>
            <Typography>Nenhum pomar deste distrito foi registado!</Typography>
          </Box>
        </Box>
      )}
      <List
        sx={{
          marginTop: "45px",
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        {farmlands?.map((farmland, key) => (
          <Box key={farmland?._id.toString()}>
            <Link to="/farmland" state={{ farmland, farmer: farmland.farmer }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Fragment>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 400, fontSize: "11px" }}
                      >
                        {`${farmland?.farmer?.fullname}`}{" "}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "gray" }}
                      >
                        {`${farmland?.farmlandType}`}{" "}
                        <span style={{ fontWeight: 400, fontSize: "11px" }}>
                          (
                          {`${farmland?.farmer?.address?.territory}: ${farmland?.label}`}
                          )
                        </span>
                      </Typography>
                      <Stack direction="row">
                        <Box sx={{ width: "50%" }}>
                          <Typography component="span" variant="body2">
                            {" "}
                            {`Declarada: ${farmland?.declaredArea} ha`}{" "}
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Typography component="span" variant="body2">
                            {" "}
                            {`Plantada: ${farmland?.actualArea} ha`}{" "}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row">
                        <Box sx={{ width: "50%" }}>
                          <Typography component="span" variant="body2">
                            {" "}
                            {`Cajueiros: ${farmland?.totalTrees}`}{" "}
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Typography component="span" variant="body2">
                            {" "}
                            {`Idade : `}
                            {getTreesAverageAge(
                              farmland?.divisions
                            )} {` anos`}{" "}
                          </Typography>
                        </Box>
                      </Stack>
                    </Fragment>
                  }
                  secondary={
                    <Typography component="div" sx={{ width: "100%" }}>
                      <span style={{ textAlign: "rigth", fontSize: "11px" }}>
                        Registo:{`${normalizeDate(farmland?.createdAt)}`}
                      </span>{" "}
                      <span
                        style={{ textAlign: "rigth", fontSize: "11px" }}
                      >{`por ${farmland?.user?.fullname}`}</span>
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Divider variant="inset" component="li" />
          </Box>
        ))}
      </List>
      <SearchModal open={false} />
      <Footer />
    </Box>
  );
};

export default FarmlandsList;
