import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "Titre", width: 130 },
  { field: "lastName", headerName: "Auteur", width: 130 },
  {
    field: "age",
    headerName: "Genre",
    type: "text",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Toutes les données",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: "policier" },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: "romance" },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: "crime" },
  { id: 4, lastName: "Stark", firstName: "Arya", age: "policier" },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: "romance" },
  { id: 6, lastName: "Melisandre", firstName: null, age: "crime" },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: "policier" },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: "romance" },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: "crime" },
];

function DataTable() {
  return (
    <>
      <Stack width={"100%"} sx={{ backgroundColor: "#fff" }}>
        <h3>Tableau de gestion des livres</h3>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Stack>
    </>
  );
}

export default DataTable;
