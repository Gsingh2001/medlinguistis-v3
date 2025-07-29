// components/HeatmapGrid.jsx
import React from "react";
import HeatMapGrid from "react-heatmap-grid";

const HeatmapGrid = ({ data, xLabels, yLabels, title }) => {
  return (
    <div style={{ maxWidth: 700, margin: "auto", marginBottom: 40 }}>
      {title && (
        <h3 style={{ borderBottom: "2px solid #1976d2", paddingBottom: 8, marginBottom: 16 }}>
          {title}
        </h3>
      )}
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        // Optional: customize colors
        // background: low value; high value: red/orange/green
        cellRender={(x, y, value) => (
          <div style={{ fontSize: 14, color: value > 0.5 ? "black" : "white" }}>
            {(value * 100).toFixed(1)}%
          </div>
        )}
        // Optional: styling the cells
        cellStyle={(x, y, ratio) => ({
          background: `rgba(71, 99, 184, ${ratio})`,
          fontWeight: "bold",
          borderRadius: 4,
          cursor: "default",
        })}
        xLabelsStyle={(index) => ({
          color: "#555",
          fontWeight: "bold",
          fontSize: 12,
        })}
        yLabelsStyle={() => ({
          color: "#555",
          fontWeight: "bold",
          fontSize: 12,
          textTransform: "capitalize",
        })}
      />
    </div>
  );
};

export default HeatmapGrid;
