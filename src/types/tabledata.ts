export interface TableData {
    id: number;
    title: string;
    place_of_origin: string;
    artist_title: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export interface TableDataResponse {
    data: TableData[];
    pagination: {
        total: number;
        limit: number;
        current_page: number;
    };
}
