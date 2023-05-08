import React from "react";
import { Pagination } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface PaginationControlProps {
  totalPages: number;
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onButtonClick: () => void;
}


export const PaginationControl: React.FC<PaginationControlProps> = ({
  totalPages,
  page,
  onPageChange,
  onButtonClick,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
<Pagination
  count={totalPages}
  page={page}
  onChange={onPageChange}
  sx={{
    "& .MuiPaginationItem-page": {
      color: "info.main",
      "&:hover": {
        backgroundColor: "info.main",
        color: "primary.dark",
      },
    },
    "& .MuiPaginationItem-icon": {
      color: "info.main",
    },
    "& .MuiPaginationItem-ellipsis": {
      color: "info.main",
    },
    "& .MuiPaginationItem-root.Mui-selected": {
      color: "primary.main",
      backgroundColor: "info.main",
    },
  }}
/>


    <Button
      variant="contained"
      className="bg-main hover:text-main hover:bg-success text-header"
      onClick={onButtonClick}
    >
      Lancer l&apos;analyse
    </Button>
  </Box>
);
