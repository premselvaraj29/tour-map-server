from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def nearest_neighbor_combined(
    distance_matrix, time_matrix, time_to_spend, total_time_required
):
    num_places = len(distance_matrix)
    unvisited = set(range(1, num_places))
    current_place = 0
    tour = [0]
    total_time = 0

    while len(unvisited) != 0:
        combined_time = lambda x: (
            time_matrix[current_place][x],
            distance_matrix[current_place][x],
        )
        nearest_neighbor = min(unvisited, key=combined_time)
        if (
            total_time + time_matrix[current_place][nearest_neighbor] + time_to_spend
            > total_time_required
        ):
            break
        tour.append(nearest_neighbor)
        unvisited.remove(nearest_neighbor)
        total_time = (
            total_time + time_matrix[current_place][nearest_neighbor] + time_to_spend
        )
        current_place = nearest_neighbor

    if total_time + time_matrix[current_place][0] > total_time_required:
        tour.pop()

    tour.append(0)
    return tour


def calculate_time(tour, time_matrix, time_to_spend):
    total_time = 0
    for i in range(len(tour) - 1):
        total_time += time_matrix[tour[i]][tour[i + 1]] + time_to_spend
    total_time -= time_to_spend
    return total_time


def calculate_distance(tour, distance_matrix):
    total_distance = 0
    for i in range(len(tour) - 1):
        total_distance += distance_matrix[tour[i]][tour[i + 1]]
    return total_distance


@app.route("/calculate_optimal_tour", methods=["POST"])
def calculate_optimal_tour():
    data = request.json
    distance_matrix = data.get("distance_matrix")
    time_matrix = data.get("time_matrix")
    time_to_spend = data.get("time_to_spend")
    total_time_required = data.get("total_time_required")

    if not all([distance_matrix, time_matrix, time_to_spend, total_time_required]):
        return jsonify({"error": "Please provide all required parameters"}), 400

    optimal_combined_tour = nearest_neighbor_combined(
        distance_matrix, time_matrix, time_to_spend, total_time_required
    )
    total_distance = calculate_distance(optimal_combined_tour, distance_matrix)
    total_time = calculate_time(optimal_combined_tour, time_matrix, time_to_spend)

    response = {
        "optimal_combined_tour": optimal_combined_tour,
        "total_distance": total_distance,
        "total_time": total_time,
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
