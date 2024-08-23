function HomeLayout(){

    return (
        <div className="min-h-[90vh]">
            <div className="drawer absolute left-0 z-50 w-fit">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="curson-pointer relative">

                    </label>
                </div>
            </div>
        </div>
    )

}

export default HomeLayout;