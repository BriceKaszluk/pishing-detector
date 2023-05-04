import React from "react";
import { Pagination } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onButtonClick: () => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  totalPages,
  currentPage,
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
      page={currentPage}
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
        "& .Mui-selected": {
          backgroundColor: "info.main",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "common.white",
            color: "primary.dark",
          },
        },
      }}
    />

    <Button
      variant="contained"
      sx={{
        color: "primary.main",
      }}
      className="bg-main hover:text-main hover:bg-success"
      onClick={onButtonClick}
    >
      Lancer l&apos;analyse
    </Button>
  </Box>
);
