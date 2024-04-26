class APIFeatures {
    // 2 arguments: Mongoose query (find()), queryString coming from express (req.query)
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // filtering
        // copy of the query object to exclude fields in filtering: destructuring + new object
        const queryObj = {...this.queryString };
        // exclude fields
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(el => delete queryObj[el])

        // advanced filtering
        let queryStr = JSON.stringify(queryObj);
        // replace operators from query gte to $gte with RegEX, matches if it is this exact word, not word containing "lt"
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|all)\b/g, match => `$${match}`);

        // find-method returns query - makes chaining possible
        // const query = Ad.find().where("canton").equals("Basel-Stadt").where("145765");
        // as soon as we use the find-method with await: query is executed and returns documents!
        // save query, chain it, and just at the and execute it with await
        // chaining find() a second time here
        this.query = this.query.find(JSON.parse(queryStr))
        
        return this;
    }

    sort() {
        // Sorting
        // ask originial query object (not copy, in the copy "sort" is excluded)
        if(this.queryString) {
            // setting sort-property on query object - sort: "fieldname"
            this.query = this.query.sort(this.queryString.sort);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }
    
    limitFields() {
        // Field limiting -- also some fields excluded via schema
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            //query = query.select("name message instrument style") - projecting
            this.query = this.query.select(fields);
        } else {
            // exclude "-__v"
            this.query = this.query.select("-__v")
        }
        console.log(this);
        return this;
    }

    paginate() {
        // Pagination, fields: page + limit
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;

        // example: page=2&limit=10
        this.query = this.query.skip(skip).limit(limit)

        return this;
    }
}

module.exports = APIFeatures;